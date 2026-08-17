import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

/* Hairline + fallback fill used when backdrop-filter isn't available */
const BAR_LINE = "rgba(255,255,255,0.10)";
const BAR_FALLBACK = "rgba(10,10,10,0.82)";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="portfolio">
        <Icon
          sf={{
            default: "square.grid.2x2",
            selected: "square.grid.2x2.fill",
          }}
        />
        <Label>Portfolio</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="about">
        <Icon
          sf={{ default: "person.circle", selected: "person.circle.fill" }}
        />
        <Label>About</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

/* Outline when idle, filled when active ‚Äî the standard app signal */
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  outline,
  filled,
  color,
  focused,
}: {
  outline: IoniconName;
  filled: IoniconName;
  color: string;
  focused: boolean;
}) {
  return (
    <Ionicons
      name={focused ? filled : outline}
      size={23}
      color={color}
    />
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const isAndroid = Platform.OS === "android";

  const barHeight = isWeb ? 62 + insets.bottom : undefined;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: "absolute",
          // Transparent on iOS + web so the blur underneath shows through
          backgroundColor: isAndroid ? colors.background : "transparent",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: BAR_LINE,
          elevation: 0,
          ...(isWeb
            ? {
                height: barHeight,
                paddingTop: 8,
                paddingBottom: 8 + insets.bottom,
              }
            : {}),
        },
        // Tighter icon-to-label rhythm
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 0.4,
          fontFamily: "Inter_600SemiBold",
          fontWeight: "600",
          marginTop: 3,
        },
        tabBarIconStyle: { marginBottom: -1 },
        tabBarBackground: () =>
          isAndroid ? null : (
            <View style={StyleSheet.absoluteFill}>
              {/* Opaque-ish fallback in case backdrop-filter is unsupported */}
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: BAR_FALLBACK },
                ]}
              />
              <BlurView
                intensity={isWeb ? 24 : 100}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
            </View>
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              outline="home-outline"
              filled="home"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: "Portfolio",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              outline="grid-outline"
              filled="grid"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              outline="person-circle-outline"
              filled="person-circle"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}

