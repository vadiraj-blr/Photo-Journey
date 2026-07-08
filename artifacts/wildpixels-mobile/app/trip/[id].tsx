import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const { width: SW, height: SH } = Dimensions.get("window");

const BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

interface GalleryPhoto {
  url: string;
  caption?: string | null;
}

interface TripDetail {
  id: number;
  title: string;
  location: string;
  country: string;
  month: string;
  year: number;
  story?: string | null;
  storySummary?: string | null;
  coverImageUrl: string;
  photoCount: number;
  tags: string[];
  featured: boolean;
  galleryPhotoUrls?: GalleryPhoto[];
  travelTips?: string[];
}

interface Reaction {
  likes: number;
  dislikes: number;
}

interface Comment {
  id: number;
  tripId: number;
  name: string;
  comment: string;
  createdAt: string;
}

function LightboxModal({
  photos,
  startIndex,
  onClose,
}: {
  photos: GalleryPhoto[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const photo = photos[index];
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={lb.overlay}>
        <Pressable
          onPress={onClose}
          style={[lb.closeBtn, { top: insets.top + 8 }]}
        >
          <Feather name="x" size={22} color="#EDE8DC" />
        </Pressable>

        <Image
          source={{ uri: photo.url }}
          style={lb.image}
          resizeMode="contain"
        />

        {photo.caption ? (
          <Text style={lb.caption}>{photo.caption}</Text>
        ) : null}

        <View style={[lb.navRow, { bottom: insets.bottom + 24 }]}>
          <Pressable
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
            style={[lb.navBtn, index === 0 && lb.navBtnDisabled]}
            disabled={index === 0}
          >
            <Feather name="chevron-left" size={24} color="#EDE8DC" />
          </Pressable>
          <Text style={lb.counter}>
            {index + 1} / {photos.length}
          </Text>
          <Pressable
            onPress={() => setIndex((i) => Math.min(photos.length - 1, i + 1))}
            style={[lb.navBtn, index === photos.length - 1 && lb.navBtnDisabled]}
            disabled={index === photos.length - 1}
          >
            <Feather name="chevron-right" size={24} color="#EDE8DC" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function GalleryGrid({
  photos,
  onPress,
}: {
  photos: GalleryPhoto[];
  onPress: (i: number) => void;
}) {
  const CELL = (SW - 4) / 3;
  const rows: GalleryPhoto[][] = [];
  for (let i = 0; i < photos.length; i += 3) {
    rows.push(photos.slice(i, i + 3));
  }
  return (
    <View>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.galleryRow}>
          {row.map((photo, ci) => {
            const globalIdx = ri * 3 + ci;
            return (
              <Pressable
                key={ci}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onPress(globalIdx);
                }}
                style={[styles.galleryCell, { width: CELL, height: CELL }]}
              >
                <Image
                  source={{ uri: photo.url }}
                  style={styles.galleryCellImage}
                  resizeMode="cover"
                />
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const colors = useColors();
  const date = new Date(comment.createdAt);
  const formatted = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <View style={[styles.commentItem, { borderBottomColor: colors.border }]}>
      <View style={styles.commentHeader}>
        <View style={[styles.commentAvatar, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.commentAvatarText, { color: colors.primary }]}>
            {comment.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.commentMeta}>
          <Text style={[styles.commentName, { color: colors.foreground }]}>
            {comment.name}
          </Text>
          <Text style={[styles.commentDate, { color: colors.mutedForeground }]}>
            {formatted}
          </Text>
        </View>
      </View>
      <Text style={[styles.commentText, { color: colors.foreground }]}>
        {comment.comment}
      </Text>
    </View>
  );
}

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const { data: trip, isLoading, isError } = useQuery<TripDetail>({
    queryKey: ["trip", id],
    queryFn: () => fetch(`${BASE}/api/trips/${id}`).then((r) => r.json()),
    enabled: !!id,
  });

  const { data: reactions } = useQuery<Reaction>({
    queryKey: ["reactions", id],
    queryFn: () =>
      fetch(`${BASE}/api/trips/${id}/reactions`).then((r) => r.json()),
    enabled: !!id,
  });

  const { data: comments } = useQuery<Comment[]>({
    queryKey: ["comments", id],
    queryFn: () =>
      fetch(`${BASE}/api/trips/${id}/comments`).then((r) => r.json()),
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: () =>
      fetch(`${BASE}/api/trips/${id}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reactions", id] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: () =>
      fetch(`${BASE}/api/trips/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: commentName.trim(),
          comment: commentText.trim(),
        }),
      }).then((r) => r.json()),
    onSuccess: () => {
      setCommentName("");
      setCommentText("");
      qc.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (isError || !trip) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={32} color={colors.mutedForeground} />
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
          Trip not found
        </Text>
        <Pressable onPress={() => router.back()} style={[styles.retryBtn, { borderColor: colors.primary }]}>
          <Text style={[styles.retryText, { color: colors.primary }]}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const gallery = trip.galleryPhotoUrls ?? [];
  const likeCount = (reactions?.likes ?? 0) + (liked ? 0 : 0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        ref={scrollRef as never}
        style={styles.screen}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        {/* Cover image */}
        <View style={styles.coverWrap}>
          <Image
            source={{ uri: trip.coverImageUrl }}
            style={[styles.cover, { height: SH * 0.48 }]}
            resizeMode="cover"
          />
          <View style={styles.coverOverlay}>
            <View style={styles.coverTags}>
              {trip.tags.slice(0, 3).map((tag) => (
                <View
                  key={tag}
                  style={[styles.tag, { backgroundColor: "rgba(240,160,21,0.18)", borderColor: "rgba(240,160,21,0.35)" }]}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.coverTitle}>{trip.title}</Text>
            <Text style={styles.coverMeta}>
              {trip.location} · {trip.month} {trip.year}
            </Text>
          </View>
        </View>

        {/* Story */}
        {trip.story ? (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              THE STORY
            </Text>
            <View style={[styles.storyAccent, { backgroundColor: colors.primary }]} />
            <Text style={[styles.story, { color: colors.foreground }]}>
              {trip.story}
            </Text>
          </View>
        ) : null}

        {/* Travel tips */}
        {trip.travelTips && trip.travelTips.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              FIELD NOTES
            </Text>
            <View
              style={[
                styles.tipsCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {trip.travelTips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <View style={[styles.tipDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.tipText, { color: colors.foreground }]}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <View style={styles.section}>
            <View style={styles.galleryHeader}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                EXPEDITION GALLERY
              </Text>
              <Text style={[styles.galleryCount, { color: colors.mutedForeground }]}>
                {gallery.length} photos
              </Text>
            </View>
            <GalleryGrid
              photos={gallery}
              onPress={(i) => setLightboxIndex(i)}
            />
          </View>
        )}

        {/* Reactions */}
        <View
          style={[
            styles.reactionsBar,
            { borderTopColor: colors.border, borderBottomColor: colors.border },
          ]}
        >
          <Pressable
            onPress={() => {
              if (!liked) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setLiked(true);
                likeMutation.mutate();
              }
            }}
            style={styles.likeBtn}
          >
            <Feather
              name="heart"
              size={22}
              color={liked ? "#F0A015" : colors.mutedForeground}
              fill={liked ? "#F0A015" : "transparent"}
            />
            <Text
              style={[
                styles.likeCount,
                { color: liked ? colors.primary : colors.mutedForeground },
              ]}
            >
              {(reactions?.likes ?? 0) + (liked ? 1 : 0)}
            </Text>
          </Pressable>
          <View style={styles.reactSpacer} />
          <Feather name="message-circle" size={18} color={colors.mutedForeground} />
          <Text style={[styles.commentCount, { color: colors.mutedForeground }]}>
            {comments?.length ?? 0}
          </Text>
        </View>

        {/* Comments */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            COMMENTS
          </Text>

          {comments && comments.length > 0 ? (
            comments.map((c) => <CommentItem key={c.id} comment={c} />)
          ) : (
            <Text style={[styles.noComments, { color: colors.mutedForeground }]}>
              Be the first to leave a comment.
            </Text>
          )}

          {/* Comment form */}
          <View
            style={[
              styles.commentForm,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>
              LEAVE A COMMENT
            </Text>
            <TextInput
              value={commentName}
              onChangeText={setCommentName}
              placeholder="Your name"
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              returnKeyType="next"
            />
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Share your thoughts…"
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={3}
              style={[
                styles.input,
                styles.inputMulti,
                {
                  backgroundColor: colors.input,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              returnKeyType="send"
            />
            <Pressable
              onPress={() => {
                if (commentName.trim() && commentText.trim()) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  commentMutation.mutate();
                }
              }}
              disabled={
                commentMutation.isPending ||
                !commentName.trim() ||
                !commentText.trim()
              }
              style={[
                styles.submitBtn,
                {
                  backgroundColor:
                    commentName.trim() && commentText.trim()
                      ? colors.primary
                      : colors.secondary,
                },
              ]}
            >
              {commentMutation.isPending ? (
                <ActivityIndicator color={colors.primaryForeground} size="small" />
              ) : (
                <Text
                  style={[
                    styles.submitText,
                    {
                      color:
                        commentName.trim() && commentText.trim()
                          ? colors.primaryForeground
                          : colors.mutedForeground,
                    },
                  ]}
                >
                  Post Comment
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        style={[styles.backBtn, { top: topInset + 8 }]}
      >
        <Feather name="arrow-left" size={20} color="#EDE8DC" />
      </Pressable>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <LightboxModal
          photos={gallery}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </View>
  );
}

const lb = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.96)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(37,37,37,0.7)",
    borderRadius: 20,
  },
  image: {
    width: SW,
    height: SW * 1.2,
  },
  caption: {
    color: "rgba(237,232,220,0.7)",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 24,
    marginTop: 12,
    fontFamily: "Inter_400Regular",
  },
  navRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 20,
  },
  navBtn: {
    padding: 10,
    backgroundColor: "rgba(37,37,37,0.8)",
    borderRadius: 24,
  },
  navBtnDisabled: { opacity: 0.3 },
  counter: {
    color: "rgba(237,232,220,0.7)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    minWidth: 50,
    textAlign: "center",
  },
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: { fontSize: 15 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderWidth: 1 },
  retryText: { fontSize: 14, fontWeight: "600" as const },

  coverWrap: { position: "relative" },
  cover: { width: SW },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
    backgroundColor: "rgba(8,8,8,0.55)",
  },
  coverTags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 2,
  },
  tagText: {
    color: "#F0A015",
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  coverTitle: {
    color: "#EDE8DC",
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 30,
    letterSpacing: 0.2,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  coverMeta: {
    color: "rgba(237,232,220,0.65)",
    fontSize: 12,
    letterSpacing: 0.5,
    fontFamily: "Inter_400Regular",
  },

  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 20,
    padding: 10,
    backgroundColor: "rgba(8,8,8,0.6)",
    borderRadius: 20,
  },

  section: { paddingHorizontal: 16, paddingTop: 24 },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 14,
  },

  storyAccent: { width: 32, height: 2, marginBottom: 14, borderRadius: 1 },
  story: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
  },

  tipsCard: {
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  tipRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  tipDot: { width: 5, height: 5, borderRadius: 3, marginTop: 8 },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },

  galleryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  galleryCount: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  galleryRow: { flexDirection: "row", gap: 2, marginBottom: 2 },
  galleryCell: { overflow: "hidden" },
  galleryCellImage: { width: "100%", height: "100%" },

  reactionsBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 24,
    gap: 8,
  },
  likeBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  likeCount: { fontSize: 14, fontFamily: "Inter_500Medium" },
  reactSpacer: { flex: 1 },
  commentCount: { fontSize: 14, fontFamily: "Inter_500Medium" },

  noComments: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 20,
    fontFamily: "Inter_400Regular",
  },

  commentItem: { paddingVertical: 16, borderBottomWidth: 1 },
  commentHeader: { flexDirection: "row", gap: 12, marginBottom: 8 },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  commentAvatarText: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  commentMeta: { justifyContent: "center" },
  commentName: { fontSize: 13, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  commentDate: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  commentText: { fontSize: 14, lineHeight: 21, fontFamily: "Inter_400Regular" },

  commentForm: { marginTop: 20, padding: 16, borderWidth: 1, gap: 12 },
  formLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  input: {
    padding: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
  },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },
  submitBtn: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { fontSize: 13, fontWeight: "600" as const, letterSpacing: 1, fontFamily: "Inter_600SemiBold" },
});
