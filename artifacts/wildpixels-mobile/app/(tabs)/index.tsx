import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const { width: SW, height: SH } = Dimensions.get("window");

const BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

interface Settings {
  heroTagline?: string;
  aboutBio?: string;
  aboutPortraitUrl?: string;
  highlightPhotoUrls?: string[];
}

interface Stats {
  tripCount: number;
  countryCount: number;
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

// Camera-lens SVG — matches the website nav logo exactly
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

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

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
      ? rawExcerpt.slice(0, 217).replace(/\s+\S*$/, "") + "…"
      : rawExcerpt
    : null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero with photo cycler ── */}
      <View style={[styles.hero, { height: SH * 0.72 }]}>
        <HeroCycler photos={heroPhotos} />
        <View style={styles.heroGradient} />

        {/* Brand mark — camera SVG + Wildpixels wordmark */}
        <View style={[styles.brandBlock, { paddingTop: topPad + 20 }]}>
          <View style={styles.brandRow}>
            <CameraLogo color="#EDE8DC" size={32} />
            <Text style={styles.brandName}>Wildpixels</Text>
          </View>
          <View style={[styles.brandLine, { backgroundColor: colors.primary }]} />
          <Text style={styles.tagline}>
            {settings?.heroTagline ?? "Wild through my lens"}
          </Text>
        </View>

        {/* Scroll hint */}
        <View style={styles.scrollHint}>
          <Feather name="chevron-down" size={20} color="rgba(237,232,220,0.5)" />
        </View>
      </View>

      {/* ── Stats strip ── */}
      {stats && (
        <View style={[styles.statsStrip, { borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.tripCount}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>EXPEDITIONS</Text>
          </View>
          <View style={[styles.statDiv, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.countryCount}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>COUNTRIES</Text>
          </View>
          <View style={[styles.statDiv, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.photoCount}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>PHOTOS</Text>
          </View>
        </View>
      )}

      {/* ── About section ── */}
      <View style={styles.aboutSection}>
        <View style={styles.aboutLeft}>
          {settings?.aboutPortraitUrl ? (
            <Image source={{ uri: settings.aboutPortraitUrl }} style={styles.portrait} resizeMode="cover" />
          ) : (
            <View style={[styles.portrait, styles.portraitPlaceholder, { backgroundColor: colors.secondary }]}>
              <Feather name="user" size={36} color={colors.mutedForeground} />
            </View>
          )}
          <View style={[styles.portraitDot, { backgroundColor: colors.primary }]} />
        </View>
        <View style={styles.aboutRight}>
          <Text style={[styles.aboutName, { color: colors.foreground }]}>Vadiraj BK</Text>
          <Text style={[styles.aboutRole, { color: colors.mutedForeground }]}>India Wildlife Photographer</Text>
          {settings?.aboutBio ? (
            <Text style={[styles.aboutBio, { color: colors.foreground }]} numberOfLines={5}>
              {settings.aboutBio}
            </Text>
          ) : null}
          <Pressable
            onPress={() => router.push("/(tabs)/about" as never)}
            style={styles.readMoreBtn}
          >
            <Text style={[styles.readMoreText, { color: colors.primary }]}>Read more</Text>
            <Feather name="arrow-right" size={12} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* ── Featured trip card ── */}
      {featuredTrip && (
        <View style={[styles.featuredSection, { borderTopColor: colors.border }]}>
          {/* Section label */}
          <View style={styles.featuredLabelRow}>
            <View style={[styles.featuredLabelLine, { backgroundColor: colors.primary }]} />
            <Text style={[styles.featuredLabelText, { color: colors.primary }]}>
              FRESH FROM THE FIELD
            </Text>
          </View>

          {/* Cover image */}
          <Pressable
            onPress={() => router.push(`/trip/${featuredTrip.id}` as never)}
            style={styles.featuredImgWrap}
          >
            <Image
              source={{ uri: featuredTrip.coverImageUrl }}
              style={styles.featuredImg}
              resizeMode="contain"
            />
            {/* Location badge */}
            <View style={[styles.featuredLocationBadge, { backgroundColor: "rgba(8,8,8,0.82)" }]}>
              <Text style={[styles.featuredLocationText, { color: colors.primary }]}>
                {featuredTrip.location}, {featuredTrip.country}
              </Text>
            </View>
          </Pressable>

          {/* Text content */}
          <View style={styles.featuredBody}>
            <Text style={[styles.featuredMeta, { color: colors.mutedForeground }]}>
              Featured Expedition · {featuredTrip.month} {featuredTrip.year}
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
                  <View key={tag} style={[styles.featuredTag, { borderColor: colors.border }]}>
                    <Text style={[styles.featuredTagText, { color: colors.mutedForeground }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            <Pressable
              onPress={() => router.push(`/trip/${featuredTrip.id}` as never)}
              style={styles.readStoryBtn}
            >
              <Text style={[styles.readStoryText, { color: colors.primary }]}>
                Read the Story
              </Text>
              <Feather name="arrow-right" size={14} color={colors.primary} />
            </Pressable>
          </View>
        </View>
      )}

      {/* ── CTA ── */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: { width: SW, position: "relative", overflow: "hidden" },
  heroGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(8,8,8,0.42)" },
  brandBlock: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  brandName: {
    color: "#EDE8DC",
    fontSize: 30,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
    fontStyle: "italic",
  },
  brandLine: { width: 40, height: 1 },
  tagline: {
    color: "rgba(237,232,220,0.85)",
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 28,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
  scrollHint: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  // Stats
  statsStrip: { flexDirection: "row", borderTopWidth: 1, borderBottomWidth: 1 },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 18 },
  statNum: {
    color: "#F0A015",
    fontSize: 24,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  statLbl: { fontSize: 8, letterSpacing: 2.5, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  statDiv: { width: 1 },

  // About
  aboutSection: { flexDirection: "row", padding: 24, gap: 20 },
  aboutLeft: { position: "relative", alignSelf: "flex-start" },
  portrait: { width: 88, height: 88, borderRadius: 44 },
  portraitPlaceholder: { alignItems: "center", justifyContent: "center" },
  portraitDot: {
    position: "absolute", bottom: 4, right: 4,
    width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: "#080808",
  },
  aboutRight: { flex: 1 },
  aboutName: { fontSize: 17, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold", marginBottom: 3 },
  aboutRole: { fontSize: 11, letterSpacing: 0.3, fontFamily: "Inter_400Regular", marginBottom: 10 },
  aboutBio: { fontSize: 13, lineHeight: 20, fontFamily: "Inter_400Regular", marginBottom: 8 },
  readMoreBtn: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start" },
  readMoreText: { fontSize: 12, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },

  // Featured trip
  featuredSection: { borderTopWidth: 1, paddingTop: 24, paddingBottom: 8 },
  featuredLabelRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  featuredLabelLine: { width: 24, height: 1.5 },
  featuredLabelText: { fontSize: 9, letterSpacing: 3.5, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  featuredImgWrap: {
    marginHorizontal: 0,
    aspectRatio: 4 / 3,
    overflow: "hidden",
    position: "relative",
    marginBottom: 16,
    backgroundColor: "#080808",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredImg: { width: "100%", height: "100%" },
  featuredLocationBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  featuredLocationText: { fontSize: 9, letterSpacing: 2, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
  featuredBody: { paddingHorizontal: 16 },
  featuredMeta: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_400Regular", marginBottom: 8 },
  featuredTitle: {
    fontSize: 26,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    lineHeight: 32,
    marginBottom: 10,
  },
  featuredExcerpt: { fontSize: 13, lineHeight: 21, fontFamily: "Inter_400Regular", marginBottom: 14 },
  featuredTags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  featuredTag: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  featuredTagText: { fontSize: 9, letterSpacing: 1.5, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
  readStoryBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  readStoryText: { fontSize: 13, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const, letterSpacing: 0.3 },

  // CTA
  ctaBlock: { paddingHorizontal: 24, marginTop: 8, marginBottom: 16 },
  ctaBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 10 },
  ctaBtnText: { fontSize: 12, fontWeight: "700" as const, letterSpacing: 3, fontFamily: "Inter_700Bold" },
});
