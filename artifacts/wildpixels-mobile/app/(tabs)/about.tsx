import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import React from "react";
import {
  ActivityIndicator,
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

const BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

interface Settings {
  aboutTitle?: string;
  aboutBio?: string;
  aboutPortraitUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactLocation?: string;
  contactInstagram?: string;
  contactFacebook?: string;
  highlightPhotoUrls?: string[];
}

interface Stats {
  tripCount: number;
  countryCount: number;
  photoCount: number;
}

function StatPill({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    </View>
  );
}

function ContactRow({
  icon,
  text,
  onPress,
}: {
  icon: string;
  text: string;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.contactRow, { borderBottomColor: colors.border }]}
      disabled={!onPress}
    >
      <View
        style={[styles.contactIcon, { backgroundColor: colors.secondary }]}
      >
        <Feather name={icon as never} size={16} color={colors.primary} />
      </View>
      <Text style={[styles.contactText, { color: colors.foreground }]}>
        {text}
      </Text>
      {onPress && (
        <Feather
          name="chevron-right"
          size={16}
          color={colors.mutedForeground}
        />
      )}
    </Pressable>
  );
}

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const { data: settings, isLoading: settingsLoading } =
    useQuery<Settings>({
      queryKey: ["settings"],
      queryFn: () => fetch(`${BASE}/api/settings`).then((r) => r.json()),
    });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["tripStats"],
    queryFn: () =>
      fetch(`${BASE}/api/trips/stats`).then((r) => r.json()),
  });

  const portrait = settings?.aboutPortraitUrl;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 20, paddingBottom: insets.bottom + 90 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Portrait */}
      <View style={styles.portraitWrap}>
        {portrait ? (
          <Image
            source={{ uri: portrait }}
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
            <Feather name="user" size={48} color={colors.mutedForeground} />
          </View>
        )}
        <View
          style={[
            styles.portraitAccent,
            { backgroundColor: colors.primary },
          ]}
        />
      </View>

      {/* Name & title */}
      <View style={styles.nameBlock}>
        <Text style={[styles.name, { color: colors.foreground }]}>
          Vadiraj BK
        </Text>
        {settings?.aboutTitle ? (
          <Text style={[styles.title, { color: colors.mutedForeground }]}>
            {settings.aboutTitle}
          </Text>
        ) : (
          <Text style={[styles.title, { color: colors.mutedForeground }]}>
            India Wildlife Photographer
          </Text>
        )}
      </View>

      {/* Stats */}
      {stats && (
        <View style={[styles.statsRow, { borderColor: colors.border }]}>
          <StatPill value={stats.tripCount} label="Trips" />
          <View
            style={[
              styles.statDivider,
              { backgroundColor: colors.border },
            ]}
          />
          <StatPill value={stats.countryCount} label="Countries" />
          <View
            style={[
              styles.statDivider,
              { backgroundColor: colors.border },
            ]}
          />
          <StatPill value={stats.photoCount} label="Photos" />
        </View>
      )}

      {/* Bio */}
      {settingsLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.bioLoader} />
      ) : settings?.aboutBio ? (
        <View style={styles.bioBlock}>
          <View
            style={[styles.bioAccent, { backgroundColor: colors.primary }]}
          />
          <Text style={[styles.bio, { color: colors.foreground }]}>
            {settings.aboutBio}
          </Text>
        </View>
      ) : null}

      {/* Highlight photos strip */}
      {settings?.highlightPhotoUrls && settings.highlightPhotoUrls.length > 0 && (
        <View style={styles.highlightStrip}>
          {settings.highlightPhotoUrls.slice(0, 4).map((url, i) => (
            <Image
              key={i}
              source={{ uri: url }}
              style={styles.highlightThumb}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      {/* Contact */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
        CONTACT
      </Text>
      <View
        style={[
          styles.contactCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {settings?.contactLocation && (
          <ContactRow icon="map-pin" text={settings.contactLocation} />
        )}
        {settings?.contactEmail && (
          <ContactRow
            icon="mail"
            text={settings.contactEmail}
            onPress={() =>
              Linking.openURL(`mailto:${settings.contactEmail}`)
            }
          />
        )}
        {settings?.contactPhone && (
          <ContactRow
            icon="phone"
            text={settings.contactPhone}
            onPress={() => Linking.openURL(`tel:${settings.contactPhone}`)}
          />
        )}
        {settings?.contactInstagram && (
          <ContactRow
            icon="instagram"
            text={`@${settings.contactInstagram}`}
            onPress={() =>
              Linking.openURL(
                `https://instagram.com/${settings.contactInstagram}`
              )
            }
          />
        )}
        {settings?.contactFacebook && (
          <ContactRow
            icon="facebook"
            text={settings.contactFacebook}
            onPress={() =>
              Linking.openURL(
                `https://facebook.com/${settings.contactFacebook}`
              )
            }
          />
        )}
      </View>

      {/* Brand footer */}
      <Text style={[styles.footer, { color: colors.mutedForeground }]}>
        WILDPIXELS
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },

  portraitWrap: {
    alignSelf: "center",
    marginBottom: 20,
    position: "relative",
  },
  portrait: { width: 130, height: 130, borderRadius: 65 },
  portraitPlaceholder: { alignItems: "center", justifyContent: "center" },
  portraitAccent: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#080808",
  },

  nameBlock: { alignItems: "center", marginBottom: 28 },
  name: {
    fontSize: 24,
    fontWeight: "600" as const,
    letterSpacing: 0.3,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    letterSpacing: 0.5,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },

  statsRow: {
    flexDirection: "row",
    borderWidth: 1,
    marginBottom: 32,
  },
  statPill: { flex: 1, alignItems: "center", paddingVertical: 16 },
  statValue: {
    color: "#F0A015",
    fontSize: 22,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "#8A8478",
    fontSize: 9,
    letterSpacing: 2,
    fontFamily: "Inter_500Medium",
  },
  statDivider: { width: 1 },

  bioLoader: { marginVertical: 20 },
  bioBlock: { flexDirection: "row", gap: 14, marginBottom: 28 },
  bioAccent: { width: 2, borderRadius: 1 },
  bio: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
  },

  highlightStrip: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 32,
  },
  highlightThumb: {
    flex: 1,
    height: 80,
  },

  sectionLabel: {
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },

  contactCard: {
    borderWidth: 1,
    marginBottom: 40,
    overflow: "hidden",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  contactIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  contactText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },

  footer: {
    textAlign: "center",
    fontSize: 11,
    letterSpacing: 6,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
});
