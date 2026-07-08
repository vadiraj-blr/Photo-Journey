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
  aboutTitle?: string;
  highlightPhotoUrls?: string[];
}

interface Stats {
  tripCount: number;
  countryCount: number;
  photoCount: number;
}

function HeroCycler({ photos }: { photos: string[] }) {
  const [current, setCurrent] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (photos.length < 2) return;
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrent((i) => (i + 1) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos.length, opacity]);

  if (!photos.length) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
      <Image
        source={{ uri: photos[current] }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
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

  const heroPhotos: string[] =
    Array.isArray(settings?.highlightPhotoUrls)
      ? settings!.highlightPhotoUrls.slice(0, 8)
      : [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Full-screen hero */}
      <View style={[styles.hero, { height: SH * 0.72 }]}>
        <HeroCycler photos={heroPhotos} />
        {/* Dark gradient overlay */}
        <View style={styles.heroGradient} />
        {/* Brand mark */}
        <View style={[styles.brandBlock, { paddingTop: topPad + 16 }]}>
          <Text style={styles.brandName}>WILDPIXELS</Text>
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

      {/* Stats strip */}
      {stats && (
        <View style={[styles.statsStrip, { borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.tripCount}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>
              EXPEDITIONS
            </Text>
          </View>
          <View style={[styles.statDiv, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.countryCount}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>
              COUNTRIES
            </Text>
          </View>
          <View style={[styles.statDiv, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.photoCount}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>
              PHOTOS
            </Text>
          </View>
        </View>
      )}

      {/* About section */}
      <View style={styles.aboutSection}>
        <View style={styles.aboutLeft}>
          {settings?.aboutPortraitUrl ? (
            <Image
              source={{ uri: settings.aboutPortraitUrl }}
              style={styles.portrait}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.portrait, styles.portraitPlaceholder, { backgroundColor: colors.secondary }]}>
              <Feather name="user" size={36} color={colors.mutedForeground} />
            </View>
          )}
          <View style={[styles.portraitDot, { backgroundColor: colors.primary }]} />
        </View>
        <View style={styles.aboutRight}>
          <Text style={[styles.aboutName, { color: colors.foreground }]}>
            Vadiraj BK
          </Text>
          <Text style={[styles.aboutRole, { color: colors.mutedForeground }]}>
            India Wildlife Photographer
          </Text>
          {settings?.aboutBio ? (
            <Text
              style={[styles.aboutBio, { color: colors.foreground }]}
              numberOfLines={5}
            >
              {settings.aboutBio}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Highlight thumbnails */}
      {heroPhotos.length > 0 && (
        <View style={styles.thumbGrid}>
          {heroPhotos.slice(0, 6).map((url, i) => (
            <Image
              key={i}
              source={{ uri: url }}
              style={styles.thumb}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      {/* CTA */}
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

  hero: { width: SW, position: "relative", overflow: "hidden" },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,8,8,0.38)",
  },
  brandBlock: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  brandName: {
    color: "#EDE8DC",
    fontSize: 14,
    fontWeight: "700" as const,
    letterSpacing: 9,
    fontFamily: "Inter_700Bold",
  },
  brandLine: { width: 40, height: 1 },
  tagline: {
    color: "rgba(237,232,220,0.85)",
    fontSize: 22,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 30,
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

  statsStrip: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 18 },
  statNum: {
    color: "#F0A015",
    fontSize: 24,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  statLbl: {
    fontSize: 8,
    letterSpacing: 2.5,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  statDiv: { width: 1 },

  aboutSection: {
    flexDirection: "row",
    padding: 24,
    gap: 20,
  },
  aboutLeft: { position: "relative", alignSelf: "flex-start" },
  portrait: { width: 88, height: 88, borderRadius: 44 },
  portraitPlaceholder: { alignItems: "center", justifyContent: "center" },
  portraitDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#080808",
  },
  aboutRight: { flex: 1 },
  aboutName: {
    fontSize: 17,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 3,
  },
  aboutRole: {
    fontSize: 11,
    letterSpacing: 0.3,
    fontFamily: "Inter_400Regular",
    marginBottom: 10,
  },
  aboutBio: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },

  thumbGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  thumb: {
    width: (SW - 32 - 10) / 3,
    height: (SW - 32 - 10) / 3,
  },

  ctaBlock: { paddingHorizontal: 24, marginBottom: 16 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  ctaBtnText: {
    fontSize: 12,
    fontWeight: "700" as const,
    letterSpacing: 3,
    fontFamily: "Inter_700Bold",
  },
});
