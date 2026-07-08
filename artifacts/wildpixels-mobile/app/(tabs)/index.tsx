import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const { width: SW } = Dimensions.get("window");
const CARD_W = (SW - 3) / 2;

const BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

interface Trip {
  id: number;
  title: string;
  location: string;
  country: string;
  month: string;
  year: number;
  coverImageUrl: string;
  photoCount: number;
  tags: string[];
  featured: boolean;
}

function FloatingBrand() {
  const insets = useSafeAreaInsets();
  const top = Platform.OS === "web" ? 67 : insets.top;
  return (
    <View
      pointerEvents="none"
      style={[styles.floatingBrand, { top }]}
    >
      <Text style={styles.brandText}>WILDPIXELS</Text>
    </View>
  );
}

function FeaturedHero({ trip, topOffset }: { trip: Trip; topOffset: number }) {
  return (
    <Pressable
      onPress={() => router.push(`/trip/${trip.id}` as never)}
      style={[styles.hero, { marginTop: topOffset }]}
    >
      <Image
        source={{ uri: trip.coverImageUrl }}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <View style={styles.heroGradient} />
      <View style={styles.heroContent}>
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>FEATURED</Text>
        </View>
        <Text style={styles.heroTitle} numberOfLines={2}>
          {trip.title}
        </Text>
        <View style={styles.heroMeta}>
          <Text style={styles.heroLocation}>
            {trip.location}
          </Text>
          <Text style={styles.heroDot}> · </Text>
          <Text style={styles.heroYear}>{trip.year}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <Pressable
      onPress={() => router.push(`/trip/${trip.id}` as never)}
      style={[styles.card, { width: CARD_W }]}
    >
      <Image
        source={{ uri: trip.coverImageUrl }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay}>
        <Text style={styles.cardLocation} numberOfLines={1}>
          {trip.location.toUpperCase()}
        </Text>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {trip.title}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardYear}>{trip.year}</Text>
          <View style={styles.cardPhotoCount}>
            <Feather name="camera" size={9} color="rgba(237,232,220,0.55)" />
            <Text style={styles.cardPhotoCountText}>{trip.photoCount}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function PortfolioScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topOffset = Platform.OS === "web" ? 67 : insets.top;

  const { data: trips, isLoading, isError, refetch } = useQuery<Trip[]>({
    queryKey: ["trips"],
    queryFn: () => fetch(`${BASE}/api/trips`).then((r) => r.json()),
  });

  const featured = trips?.find((t) => t.featured) ?? trips?.[0];
  const rest = trips?.filter((t) => t.id !== featured?.id) ?? [];

  if (isLoading && !trips) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="wifi-off" size={32} color={colors.mutedForeground} />
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
          Could not load trips
        </Text>
        <Pressable
          onPress={() => refetch()}
          style={[styles.retryBtn, { borderColor: colors.primary }]}
        >
          <Text style={[styles.retryText, { color: colors.primary }]}>
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={rest}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            {featured && (
              <FeaturedHero trip={featured} topOffset={topOffset + 50} />
            )}
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>TRIP REPORTS</Text>
              <View style={styles.sectionLine} />
            </View>
          </>
        }
        renderItem={({ item }) => <TripCard trip={item} />}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        scrollEnabled={!!rest.length}
        showsVerticalScrollIndicator={false}
      />
      <FloatingBrand />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: { fontSize: 15 },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  retryText: { fontSize: 14, fontWeight: "600" as const },

  floatingBrand: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 12,
    zIndex: 20,
  },
  brandText: {
    color: "#EDE8DC",
    fontSize: 12,
    fontWeight: "700" as const,
    letterSpacing: 7,
    fontFamily: "Inter_700Bold",
  },

  hero: { width: SW, height: 440, marginBottom: 2 },
  heroImage: { width: "100%", height: "100%" },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "rgba(0,0,0,0)",
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
    backgroundColor: "rgba(8,8,8,0.5)",
  },
  featuredBadge: {
    backgroundColor: "#F0A015",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  featuredBadgeText: {
    color: "#080808",
    fontSize: 9,
    fontWeight: "700" as const,
    letterSpacing: 2.5,
    fontFamily: "Inter_700Bold",
  },
  heroTitle: {
    color: "#EDE8DC",
    fontSize: 26,
    fontWeight: "600" as const,
    lineHeight: 32,
    letterSpacing: 0.2,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  heroMeta: { flexDirection: "row", alignItems: "center" },
  heroLocation: {
    color: "rgba(237,232,220,0.75)",
    fontSize: 12,
    letterSpacing: 0.5,
    fontFamily: "Inter_400Regular",
  },
  heroDot: { color: "rgba(237,232,220,0.4)", fontSize: 12 },
  heroYear: {
    color: "#F0A015",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },

  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 14,
    gap: 14,
  },
  sectionTitle: {
    color: "#8A8478",
    fontSize: 10,
    fontWeight: "600" as const,
    letterSpacing: 3.5,
    fontFamily: "Inter_600SemiBold",
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: "#252525" },

  row: { gap: 2, paddingHorizontal: 2 },
  listContent: { paddingBottom: 100 },

  card: { height: 190, marginBottom: 2, overflow: "hidden" },
  cardImage: { width: "100%", height: "100%" },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  cardLocation: {
    color: "rgba(237,232,220,0.55)",
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 3,
    fontFamily: "Inter_400Regular",
  },
  cardTitle: {
    color: "#EDE8DC",
    fontSize: 12,
    fontWeight: "600" as const,
    lineHeight: 16,
    fontFamily: "Inter_600SemiBold",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  cardYear: {
    color: "#F0A015",
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  cardPhotoCount: { flexDirection: "row", alignItems: "center", gap: 3 },
  cardPhotoCountText: {
    color: "rgba(237,232,220,0.55)",
    fontSize: 9,
    fontFamily: "Inter_400Regular",
  },
});
