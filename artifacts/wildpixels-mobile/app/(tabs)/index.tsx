import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

/* Layout constants ‚Äî one gutter value used everywhere */
const GUTTER = 20;
const RADIUS = 18;
const CARD_FILL = "rgba(255,255,255,0.045)";
const CARD_LINE = "rgba(255,255,255,0.09)";
const TABBAR_CLEARANCE = 108;

interface Settings {
  heroTagline?: string;
  aboutBio?: string;
  aboutPortraitUrl?: string;
  highlightPhotoUrls?: string[];
}

interface Stats {
  tripCount: number;
  placeCount: number;
  photoCount: number;
}

interface Trip {
  id: number;
  title: string;
  location: string;
  country: string;
  month: string;
  year: number;
  story?: string | null;
  storySummary?: string | null;
  coverImageUrl: string;
  tags: string[];
}

// Camera-lens SVG ‚Äî matches the website nav logo exactly
function CameraLogo({ color = "#EDE8DC", size = 36 }: { color?: string; size?: number }) {
  const s = size;
  const cx = s / 2;
  const r = cx - cx * (1 / 28);
  const sw = (1.2 / 28) * s;
  const innerR = (4.5 / 28) * s;
  const tick = (4.5 / 28) * s;
  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Circle cx={cx} cy={cx} r={r} stroke={color} strokeWidth={sw} />
      <Circle cx={cx} cy={cx} r={innerR} fill={color} />
      <Line x1={cx} y1={sw / 2} x2={cx} y2={tick} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={cx} y1={s - tick} x2={cx} y2={s - sw / 2} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={sw / 2} y1={cx} x2={tick} y2={cx} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={s - tick} y1={cx} x2={s - sw / 2} y2={cx} stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </Svg>
  );
}

function HeroCycler({ photos }: { photos: string[] }) {
  const [current, setCurrent] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (photos.length < 2) return;
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]).start();
      setCurrent((i) => (i + 1) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos.length, opacity]);

  if (!photos.length) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
      <Image source={{ uri: photos[current] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
    </Animated.View>
  );
}

/* Small-caps section label with accent rule */
function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={[styles.sectionLabelLine, { backgroundColor: color }]} />
      <Text style={[styles.sectionLabelText, { color }]}>{text}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width: winW, height: winH } = useWindowDimensions();

  // Live viewport measurement so Safari's collapsing URL bar can't break the hero
  const heroHeight = Math.max(430, Math.min(winH * 0.66, 640));
  const topPad = Platform.OS === "web" ? 24 : insets.top;

  useEffect(() => {
    fetch(`${BASE}/api/analytics/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "mobile", path: "home" }),
    }).catch(() => {});
  }, []);

  const { data: settings } = useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: () => fetch(`${BASE}/api/settings`).then((r) => r.json()),
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["tripStats"],
    queryFn: () => fetch(`${BASE}/api/trips/stats`).then((r) => r.json()),
  });

  const { data: featured } = useQuery<Trip[]>({
    queryKey: ["featured"],
    queryFn: () => fetch(`${BASE}/api/trips/featured`).then((r) => r.json()),
  });

  const heroPhotos: string[] = Array.isArray(settings?.highlightPhotoUrls)
    ? settings!.highlightPhotoUrls.slice(0, 10)
    : [];

  const featuredTrip = featured?.[0] ?? null;
  const rawExcerpt =
    featuredTrip?.storySummary?.trim() ||
    featuredTrip?.story?.slice(0, 220)?.trim();
  const excerpt = rawExcerpt
    ? rawExcerpt.length > 220
      ? rawExcerpt.slice(0, 217).replace(/\s+\S*$/, "") + "‚Ä¶"
      : rawExcerpt
    : null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + TABBAR_CLEARANCE }}
      showsVerticalScrollIndicator={false}
    >
      {/* ‚îÄ‚îÄ Hero ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ‚îÄ
          Text is bottom-anchored over a real gradient scrim so the
          photo stays clean at the top and legible at the bottom. */}
      <View style={[styles.hero, { width: winW, height: heroHeight }]}>
        <HeroCycler photos={heroPhotos} />

        {/* Light top scrim so status bar / URL bar area doesn't clash */}
        <LinearGradient
          colors={["rgba(8,8,8,0.55)", "rgba(8,8,8,0)"]}
          style={[styles.scrimTop, { height: topPad + 80 }]}
          pointerEvents="none"
        />

        {/* Strong bottom scrim ‚Äî carries the wordmark */}
        <LinearGradient
          colors={[
            "rgba(8,8,8,0)",
            "rgba(8,8,8,0.35)",
            "rgba(8,8,8,0.78)",
            "rgba(8,8,8,0.96)",
          ]}
          locations={[0, 0.4, 0.75, 1]}
          style={styles.scrimBottom}
          pointerEvents="none"
        />

        {/* Brand block ‚Äî anchored to the bottom of the hero */}
        <View style={styles.brandBlock}>
          <View style={styles.brandRow}>
            <CameraLogo color="#EDE8DC" size={30} />
            <Text style={styles.brandName}>Wildpixels</Text>
          </View>
          <View style={[styles.brandLine, { backgroundColor: colors.primary }]} />
          <Text style={styles.tagline}>
            {settings?.heroTagline ?? "Wild through my lens"}
          </Text>
        </View>
      </View>

      {/* ‚îÄ‚îÄ Stats card ‚îÄ‚îÄ */}
      {stats && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.tripCount}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>TRIPS</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.placeCount}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>LOCATIONS</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.photoCount}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>PHOTOS</Text>
          </View>
        </View>
      )}

      {/* ‚îÄ‚îÄ About card ‚îÄ‚îÄ */}
      <Pressable
        onPress={() => router.push("/(tabs)/about" as never)}
        style={styles.aboutCard}
      >
        <View style={styles.aboutHeader}>
          <View style={styles.aboutLeft}>
            {settings?.aboutPortraitUrl ? (
              <Image source={{ uri: settings.aboutPortraitUrl }} style={styles.portrait} resizeMode="cover" />
            ) : (
              <View style={[styles.portrait, styles.portraitPlaceholder]}>
                <Feather name="user" size={28} color={colors.mutedForeground} />
              </View>
            )}
            <View style={[styles.portraitDot, { backgroundColor: colors.primary }]} />
          </View>
          <View style={styles.aboutHeaderText}>
            <Text style={[styles.aboutName, { color: colors.foreground }]}>Vadiraj BK</Text>
            <Text style={[styles.aboutRole, { color: colors.mutedForeground }]}>
              India Wildlife Photographer
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </View>

        {settings?.aboutBio ? (
          <Text style={[styles.aboutBio, { color: colors.mutedForeground }]} numberOfLines={4}>
            {settings.aboutBio}
          </Text>
        ) : null}
      </Pressable>

      {/* ‚îÄ‚îÄ Featured trip ‚îÄ‚îÄ */}
      {featuredTrip && (
        <View style={styles.featuredSection}>
          <SectionLabel text="FRESH FROM THE FIELD" color={colors.primary} />

          <Pressable
            onPress={() => router.push(`/trip/${featuredTrip.id}` as never)}
            style={styles.featuredCard}
          >
            <View style={styles.featuredImgWrap}>
              <Image
                source={{ uri: featuredTrip.coverImageUrl }}
                style={styles.featuredImg}
                resizeMode="contain"
              />
              <View style={styles.featuredLocationBadge}>
                <Feather name="map-pin" size={9} color={colors.primary} />
                <Text style={[styles.featuredLocationText, { color: colors.primary }]}>
                  {featuredTrip.location}, {featuredTrip.country}
                </Text>
              </View>
            </View>

            <View style={styles.featuredBody}>
              <Text style={[styles.featuredMeta, { color: colors.mutedForeground }]}>
                {featuredTrip.month} {featuredTrip.year}
              </Text>
              <Text style={[styles.featuredTitle, { color: colors.foreground }]}>
                {featuredTrip.title}
              </Text>
              {excerpt ? (
                <Text style={[styles.featuredExcerpt, { color: colors.mutedForeground }]}>
                  {excerpt}
                </Text>
              ) : null}
              {(featuredTrip.tags?.length ?? 0) > 0 && (
                <View style={styles.featuredTags}>
                  {featuredTrip.tags.slice(0, 3).map((tag) => (
                    <View key={tag} style={styles.featuredTag}>
                      <Text style={[styles.featuredTagText, { color: colors.mutedForeground }]}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={styles.readStoryBtn}>
                <Text style={[styles.readStoryText, { color: colors.primary }]}>
                  Read the Story
                </Text>
                <Feather name="arrow-right" size={14} color={colors.primary} />
              </View>
            </View>
          </Pressable>
        </View>
      )}

      {/* ‚îÄ‚îÄ CTA ‚îÄ‚îÄ */}
      <View style={styles.ctaBlock}>
        <Pressable
          onPress={() => router.push("/(tabs)/portfolio" as never)}
          style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.ctaBtnText, { color: colors.primaryForeground }]}>
            VIEW ALL TRIPS
          </Text>
          <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
        </Pressable>
      </View>

      {/* ‚îÄ‚îÄ Footer ‚îÄ‚îÄ */}
      <View style={styles.footerBlock}>
        <View style={styles.footerRule} />
        <Text style={[styles.footerBrand, { color: colors.mutedForeground }]}>WILDPIXELS</Text>
        <Text style={[styles.footerCopy, { color: colors.mutedForeground }]}>
          ¬© {new Date().getFullYear()} Vadiraj BK ¬∑ All rights reserved
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Hero */
  hero: { position: "relative", overflow: "hidden" },
  scrimTop: { position: "absolute", top: 0, left: 0, right: 0 },
  scrimBottom: { position: "absolute", bottom: 0, left: 0, right: 0, height: 260 },
  brandBlock: {
    position: "absolute",
    bottom: 34,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 12,
    paddingHorizontal: GUTTER + 4,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 11 },
  brandName: {
    color: "#EDE8DC",
    fontSize: 29,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.4,
    fontStyle: "italic",
  },
  brandLine: { width: 34, height: 1 },
  tagline: {
    color: "rgba(237,232,220,0.78)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },

  /* Stats card */
  statsCard: {
    flexDirection: "row",
    marginHorizontal: GUTTER,
    marginTop: -22,
    borderRadius: RADIUS,
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: CARD_LINE,
    paddingVertical: 16,
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: {
    color: "#F0A015",
    fontSize: 23,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    marginBottom: 5,
  },
  statLbl: {
    fontSize: 8,
    letterSpacing: 1.8,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  statDiv: { width: 1, backgroundColor: CARD_LINE, marginVertical: 2 },

  /* About card */
  aboutCard: {
    marginHorizontal: GUTTER,
    marginTop: 14,
    padding: 16,
    borderRadius: RADIUS,
    backgroundColor: CARD_FILL,
    borderWidth: 1,
    borderColor: CARD_LINE,
  },
  aboutHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
  aboutLeft: { position: "relative" },
  portrait: { width: 58, height: 58, borderRadius: 29 },
  portraitPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  portraitDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#0D0D0D",
  },
  aboutHeaderText: { flex: 1 },
  aboutName: {
    fontSize: 17,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 3,
  },
  aboutRole: {
    fontSize: 10,
    letterSpacing: 1.4,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
  },
  aboutBio: {
    fontSize: 13,
    lineHeight: 21,
    fontFamily: "Inter_400Regular",
    marginTop: 14,
  },

  /* Section label */
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: GUTTER,
    marginBottom: 12,
  },
  sectionLabelLine: { width: 20, height: 1.5 },
  sectionLabelText: {
    fontSize: 9,
    letterSpacing: 3,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },

  /* Featured */
  featuredSection: { marginTop: 30 },
  featuredCard: {
    marginHorizontal: GUTTER,
    borderRadius: RADIUS,
    backgroundColor: CARD_FILL,
    borderWidth: 1,
    borderColor: CARD_LINE,
    overflow: "hidden",
  },
  featuredImgWrap: {
    aspectRatio: 4 / 3,
    position: "relative",
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredImg: { width: "100%", height: "100%" },
  featuredLocationBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: "rgba(8,8,8,0.85)",
  },
  featuredLocationText: {
    fontSize: 9,
    letterSpacing: 1.4,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600" as const,
  },
  featuredBody: { padding: 16 },
  featuredMeta: {
    fontSize: 9,
    letterSpacing: 2,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    marginBottom: 7,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    lineHeight: 28,
    marginBottom: 9,
  },
  featuredExcerpt: {
    fontSize: 13,
    lineHeight: 21,
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
  },
  featuredTags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  featuredTag: {
    borderWidth: 1,
    borderColor: CARD_LINE,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  featuredTagText: {
    fontSize: 9,
    letterSpacing: 1.2,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600" as const,
  },
  readStoryBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  readStoryText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600" as const,
    letterSpacing: 0.3,
  },

  /* CTA */
  ctaBlock: { paddingHorizontal: GUTTER, marginTop: 26 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
    borderRadius: 100,
  },
  ctaBtnText: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 2.6,
    fontFamily: "Inter_700Bold",
  },

  /* Footer */
  footerBlock: { alignItems: "center", gap: 6, marginTop: 34, paddingHorizontal: GUTTER },
  footerRule: {
    width: 46,
    height: 1,
    backgroundColor: CARD_LINE,
    marginBottom: 12,
  },
  footerBrand: {
    fontSize: 10,
    letterSpacing: 5,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  footerCopy: { fontSize: 10, letterSpacing: 0.3, fontFamily: "Inter_400Regular" },
});

