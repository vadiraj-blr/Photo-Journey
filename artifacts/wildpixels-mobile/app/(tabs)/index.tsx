import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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
}

interface Stats {
  tripCount: number;
  countryCount: number;
  photoCount: number;
}

interface GalleryPhoto {
  url: string;
  caption?: string | null;
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
  galleryPhotoUrls?: GalleryPhoto[];
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

  const { data: featured, isLoading: featuredLoading } = useQuery<Trip[]>({
    queryKey: ["featured"],
    queryFn: () => fetch(`${BASE}/api/trips/featured`).then((r) => r.json()),
  });

  const { data: allTrips } = useQuery<Trip[]>({
    queryKey: ["trips"],
    queryFn: () => fetch(`${BASE}/api/trips`).then((r) => r.json()),
  });

  const featuredTrip = featured?.[0] ?? null;

  const excerpt = featuredTrip
    ? (
        featuredTrip.storySummary?.trim() ||
        featuredTrip.story?.slice(0, 200)?.trim()
      )?.replace(/\s+\S*$/, "") + "…"
    : null;

  // Collect admin-selected photos (galleryPhotoUrls only, no Google Photos fallback)
  const adminPhotos: { url: string; tripId: number }[] = [];
  if (allTrips) {
    for (const trip of allTrips) {
      if (Array.isArray(trip.galleryPhotoUrls) && trip.galleryPhotoUrls.length > 0) {
        for (const photo of trip.galleryPhotoUrls) {
          adminPhotos.push({ url: photo.url, tripId: trip.id });
        }
      }
    }
  }
  // Take up to 9 photos, sampled across trips
  const displayPhotos = adminPhotos.slice(0, 9);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Featured trip hero */}
      <View style={[styles.hero, { height: SH * 0.72 }]}>
        {featuredLoading || !featuredTrip ? (
          <View style={[styles.heroPlaceholder, { backgroundColor: colors.card }]}>
            {featuredLoading && <ActivityIndicator color={colors.primary} />}
          </View>
        ) : (
          <Image
            source={{ uri: featuredTrip.coverImageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        )}

        {/* Dark gradient overlay */}
        <View style={styles.heroGradient} />

        {/* Brand mark at top */}
        <View style={[styles.brandBlock, { paddingTop: topPad + 16 }]}>
          <Text style={styles.brandName}>WILDPIXELS</Text>
          <View style={[styles.brandLine, { backgroundColor: colors.primary }]} />
          <Text style={styles.tagline}>
            {settings?.heroTagline ?? "Wild through my lens"}
          </Text>
        </View>

        {/* Featured trip info at bottom */}
        {featuredTrip && (
          <View style={styles.featuredOverlay}>
            <View style={styles.featuredBadgeRow}>
              <View style={[styles.featuredDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.featuredBadge, { color: colors.primary }]}>
                FRESH FROM THE FIELD · {featuredTrip.month} {featuredTrip.year}
              </Text>
            </View>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {featuredTrip.title}
            </Text>
            <Text style={styles.featuredLocation}>
              {featuredTrip.location}, {featuredTrip.country}
            </Text>
            <Pressable
              onPress={() => router.push(`/trip/${featuredTrip.id}` as never)}
              style={[styles.featuredBtn, { borderColor: colors.primary }]}
            >
              <Text style={[styles.featuredBtnText, { color: colors.primary }]}>
                READ THE STORY
              </Text>
              <Feather name="arrow-right" size={13} color={colors.primary} />
            </Pressable>
          </View>
        )}

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
            <View
              style={[
                styles.portrait,
                styles.portraitPlaceholder,
                { backgroundColor: colors.secondary },
              ]}
            >
              <Feather name="user" size={36} color={colors.mutedForeground} />
            </View>
          )}
          <View
            style={[styles.portraitDot, { backgroundColor: colors.primary }]}
          />
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

      {/* Admin-selected trip photos */}
      {displayPhotos.length > 0 && (
        <View style={styles.gallerySection}>
          <View style={styles.gallerySectionHeader}>
            <Text style={[styles.gallerySectionLabel, { color: colors.mutedForeground }]}>
              SELECTED HIGHLIGHTS
            </Text>
            <View style={[styles.gallerySectionLine, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.photoGrid}>
            {displayPhotos.map((photo, i) => (
              <Pressable
                key={i}
                onPress={() => router.push(`/trip/${photo.tripId}` as never)}
                style={styles.photoCell}
              >
                <Image
                  source={{ uri: photo.url }}
                  style={styles.photoCellImage}
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* CTA */}
      <View style={styles.ctaBlock}>
        <Pressable
          onPress={() => router.push("/(tabs)/portfolio" as never)}
          style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
        >
          <Text
            style={[styles.ctaBtnText, { color: colors.primaryForeground }]}
          >
            VIEW ALL TRIPS
          </Text>
          <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const CELL = (SW - 4) / 3;

const styles = StyleSheet.create({
  container: { flex: 1 },

  hero: { width: SW, position: "relative", overflow: "hidden" },
  heroPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,8,8,0.45)",
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

  featuredOverlay: {
    position: "absolute",
    bottom: 44,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  featuredBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  featuredDot: { width: 5, height: 5, borderRadius: 3 },
  featuredBadge: {
    fontSize: 9,
    letterSpacing: 2.5,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  featuredTitle: {
    color: "#EDE8DC",
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    lineHeight: 34,
    marginBottom: 6,
  },
  featuredLocation: {
    color: "rgba(237,232,220,0.6)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  featuredBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  featuredBtnText: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },

  scrollHint: {
    position: "absolute",
    bottom: 16,
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

  gallerySection: { marginBottom: 24 },
  gallerySectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  gallerySectionLabel: {
    fontSize: 9,
    letterSpacing: 3,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  gallerySectionLine: { flex: 1, height: 1 },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  photoCell: { width: CELL, height: CELL, overflow: "hidden" },
  photoCellImage: { width: "100%", height: "100%" },

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
