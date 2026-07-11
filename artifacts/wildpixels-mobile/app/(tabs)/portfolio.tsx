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

function TripCard({ trip }: { trip: Trip }) {
  return (
    <Pressable
      onPress={() => router.push(`/trip/${trip.id}` as never)}
      style={[styles.card, { width: CARD_W }]}
    >
      <Image
        source={{ uri: trip.coverImageUrl }}
        style={styles.cardImage}
        resizeMode="contain"
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
            <Feather
              name="camera"
              size={9}
              color="rgba(237,232,220,0.55)"
            />
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

  const {
    data: trips,
    isLoading,
    isError,
    refetch,
  } = useQuery<Trip[]>({
    queryKey: ["trips"],
    queryFn: () => fetch(`${BASE}/api/trips`).then((r) => r.json()),
  });

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
        data={trips ?? []}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View
            style={[
              styles.header,
              { paddingTop: topOffset + 16 },
            ]}
          >
            <Text style={styles.headerTitle}>TRIP REPORTS</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              {trips?.length ?? 0} expeditions
            </Text>
          </View>
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
        scrollEnabled={!!(trips && trips.length > 0)}
        showsVerticalScrollIndicator={false}
      />
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

  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: "#EDE8DC",
    fontSize: 13,
    fontWeight: "700" as const,
    letterSpacing: 5,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },

  row: { gap: 2, paddingHorizontal: 2 },
  listContent: {},

  card: { height: 200, marginBottom: 2, overflow: "hidden", backgroundColor: "#080808" },
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
  cardYear: { color: "#F0A015", fontSize: 10, fontFamily: "Inter_500Medium" },
  cardPhotoCount: { flexDirection: "row", alignItems: "center", gap: 3 },
  cardPhotoCountText: {
    color: "rgba(237,232,220,0.55)",
    fontSize: 9,
    fontFamily: "Inter_400Regular",
  },
});
