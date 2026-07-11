import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  placeCount: number;
  photoCount: number;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  coverImageUrl?: string;
  publishedAt?: string;
}

function StatPill({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    </View>
  );
}

function ContactChip({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.contactChip, { backgroundColor: colors.card, borderColor: colors.border }]}
      disabled={!onPress}
    >
      <View style={[styles.chipIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon as never} size={14} color={colors.primary} />
      </View>
      <Text style={[styles.chipLabel, { color: colors.foreground }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    fetch(`${BASE}/api/analytics/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "mobile", path: "about" }),
    }).catch(() => {});
  }, []);

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

  const { data: articles } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: () => fetch(`${BASE}/api/articles`).then((r) => r.json()),
  });

  const portrait = settings?.aboutPortraitUrl;
  const recentArticles = (articles ?? []).slice(0, 2);

  async function handleSubscribe() {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) return;
    setSubscribeStatus("loading");
    try {
      const res = await fetch(`${BASE}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      setSubscribeStatus(res.ok ? "done" : "error");
    } catch {
      setSubscribeStatus("error");
    }
  }

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
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatPill value={stats.placeCount ?? stats.countryCount} label="Locations" />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatPill value={stats.photoCount} label="Photos" />
        </View>
      )}

      {/* Bio */}
      {settingsLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.bioLoader} />
      ) : settings?.aboutBio ? (
        <View style={styles.bioBlock}>
          <View style={[styles.bioAccent, { backgroundColor: colors.primary }]} />
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

      {/* Journal */}
      {recentArticles.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            JOURNAL
          </Text>
          <View style={[styles.journalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {recentArticles.map((article, i) => (
              <Pressable
                key={article.id}
                style={[
                  styles.journalRow,
                  { borderBottomColor: colors.border },
                  i === recentArticles.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => {
                  const domain = process.env.EXPO_PUBLIC_DOMAIN ?? "";
                  if (domain) Linking.openURL(`https://${domain}/field-notes/${article.slug}`);
                }}
              >
                <View style={styles.journalText}>
                  <Text style={[styles.journalTitle, { color: colors.foreground }]} numberOfLines={1}>
                    {article.title}
                  </Text>
                  {article.excerpt ? (
                    <Text style={[styles.journalExcerpt, { color: colors.mutedForeground }]} numberOfLines={2}>
                      {article.excerpt}
                    </Text>
                  ) : null}
                </View>
                <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      {/* Contact */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
        CONTACT
      </Text>
      <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {settings?.contactLocation && (
          <View style={[styles.contactLocRow, { borderBottomColor: colors.border }]}>
            <Feather name="map-pin" size={13} color={colors.mutedForeground} />
            <Text style={[styles.contactLocText, { color: colors.mutedForeground }]}>
              {settings.contactLocation}
            </Text>
          </View>
        )}
        <View style={styles.contactChipsRow}>
          {settings?.contactEmail && (
            <ContactChip
              icon="mail"
              label={settings.contactEmail}
              onPress={() => Linking.openURL(`mailto:${settings.contactEmail}`)}
            />
          )}
          {settings?.contactPhone && (
            <ContactChip
              icon="phone"
              label={settings.contactPhone}
              onPress={() => Linking.openURL(`tel:${settings.contactPhone}`)}
            />
          )}
          {settings?.contactInstagram && (
            <ContactChip
              icon="instagram"
              label={`@${settings.contactInstagram}`}
              onPress={() => Linking.openURL(`https://instagram.com/${settings.contactInstagram}`)}
            />
          )}
          {settings?.contactFacebook && (
            <ContactChip
              icon="facebook"
              label={settings.contactFacebook}
              onPress={() => Linking.openURL(`https://facebook.com/${settings.contactFacebook}`)}
            />
          )}
        </View>
      </View>

      {/* Subscribe */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
        STAY UPDATED
      </Text>
      <View style={[styles.subscribeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.subscribeHeading, { color: colors.foreground }]}>
          New expeditions in your inbox
        </Text>
        <Text style={[styles.subscribeSubtext, { color: colors.mutedForeground }]}>
          Get notified when Vadiraj publishes a new trip report or field note.
        </Text>
        {subscribeStatus === "done" ? (
          <View style={styles.subscribeSuccess}>
            <Feather name="check-circle" size={18} color={colors.primary} />
            <Text style={[styles.subscribeSuccessText, { color: colors.primary }]}>
              You're subscribed!
            </Text>
          </View>
        ) : (
          <View style={styles.subscribeRow}>
            <TextInput
              style={[
                styles.subscribeInput,
                { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground },
              ]}
              placeholder="your@email.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={subscribeStatus !== "loading"}
            />
            <Pressable
              style={[styles.subscribeBtn, { backgroundColor: colors.primary, opacity: subscribeStatus === "loading" ? 0.6 : 1 }]}
              onPress={handleSubscribe}
              disabled={subscribeStatus === "loading"}
            >
              {subscribeStatus === "loading" ? (
                <ActivityIndicator size="small" color="#080808" />
              ) : (
                <Feather name="arrow-right" size={16} color="#080808" />
              )}
            </Pressable>
          </View>
        )}
        {subscribeStatus === "error" && (
          <Text style={[styles.subscribeError, { color: "#E05555" }]}>
            Something went wrong. Please try again.
          </Text>
        )}
      </View>

      {/* Brand footer with copyright */}
      <View style={styles.footerBlock}>
        <Text style={[styles.footerBrand, { color: colors.mutedForeground }]}>
          WILDPIXELS
        </Text>
        <Text style={[styles.footerCopy, { color: colors.mutedForeground }]}>
          © {new Date().getFullYear()} Vadiraj BK · All rights reserved
        </Text>
      </View>
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

  // Journal
  journalCard: {
    borderWidth: 1,
    marginBottom: 32,
    overflow: "hidden",
  },
  journalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  journalText: { flex: 1 },
  journalTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 3,
  },
  journalExcerpt: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Inter_400Regular",
  },

  // Contact — compact chip layout
  contactCard: {
    borderWidth: 1,
    marginBottom: 32,
    overflow: "hidden",
    padding: 14,
  },
  contactLocRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  contactLocText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  contactChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  contactChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  chipIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chipLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    maxWidth: 130,
  },

  // Subscribe
  subscribeCard: {
    borderWidth: 1,
    marginBottom: 40,
    padding: 16,
  },
  subscribeHeading: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
  },
  subscribeSubtext: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
  },
  subscribeRow: {
    flexDirection: "row",
    gap: 8,
  },
  subscribeInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  subscribeBtn: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeSuccess: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  subscribeSuccessText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  subscribeError: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },

  // Footer
  footerBlock: { alignItems: "center", gap: 6, marginBottom: 8 },
  footerBrand: {
    fontSize: 11,
    letterSpacing: 6,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  footerCopy: {
    fontSize: 10,
    letterSpacing: 0.3,
    fontFamily: "Inter_400Regular",
  },
});
