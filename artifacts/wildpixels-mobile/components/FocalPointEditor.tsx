import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureDetector, GestureHandlerRootView, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SW } = Dimensions.get("window");
const CONT_W = SW;
const CONT_H = SW * (4 / 3);

interface Props {
  visible: boolean;
  tripId: number;
  imageUrl: string;
  initialFocalX?: number;
  initialFocalY?: number;
  apiBase: string;
  onSaved: (focalX: number, focalY: number) => void;
  onClose: () => void;
}

export function FocalPointEditor({
  visible,
  tripId,
  imageUrl,
  initialFocalX = 0.5,
  initialFocalY = 0.5,
  apiBase,
  onSaved,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const lastTx = useSharedValue(0);
  const lastTy = useSharedValue(0);
  const lastScale = useSharedValue(1);

  useEffect(() => {
    if (visible && imageUrl) {
      Image.getSize(
        imageUrl,
        (w, h) => setImgSize({ w, h }),
        () => {},
      );
    }
  }, [visible, imageUrl]);

  useEffect(() => {
    if (visible) {
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 1;
      lastTx.value = 0;
      lastTy.value = 0;
      lastScale.value = 1;
    }
  }, [visible]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = lastTx.value + e.translationX;
      translateY.value = lastTy.value + e.translationY;
    })
    .onEnd(() => {
      lastTx.value = translateX.value;
      lastTy.value = translateY.value;
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.5, Math.min(6, lastScale.value * e.scale));
    })
    .onEnd(() => {
      lastScale.value = scale.value;
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleReset = useCallback(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
    lastTx.value = 0;
    lastTy.value = 0;
    lastScale.value = 1;
  }, []);

  const handleSave = useCallback(async () => {
    const tx = translateX.value;
    const ty = translateY.value;
    const s = scale.value;

    let focalX = 0.5;
    let focalY = 0.5;

    if (imgSize) {
      const cs = Math.max(CONT_W / imgSize.w, CONT_H / imgSize.h);
      focalX = Math.max(0, Math.min(1, 0.5 - tx / (cs * s * imgSize.w)));
      focalY = Math.max(0, Math.min(1, 0.5 - ty / (cs * s * imgSize.h)));
    }

    setSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focalX, focalY }),
      });
      if (!res.ok) throw new Error("Server error");
      onSaved(focalX, focalY);
      Alert.alert(
        "Saved",
        `Focal point set to ${Math.round(focalX * 100)}% × ${Math.round(focalY * 100)}%`,
      );
    } catch {
      Alert.alert("Error", "Failed to save focal point. Try again.");
    } finally {
      setSaving(false);
    }
  }, [imgSize, tripId, apiBase, onSaved]);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={s.root}>
        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={onClose} style={s.headerBtn} hitSlop={12}>
            <Text style={s.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={s.title}>SET FOCAL POINT</Text>
          <Pressable onPress={handleReset} style={s.headerBtn} hitSlop={12}>
            <Text style={s.resetText}>Reset</Text>
          </Pressable>
        </View>

        <Text style={s.hint}>Pan & pinch to frame the subject · crosshair = saved point</Text>

        {/* Image canvas */}
        <View style={s.canvas}>
          <GestureDetector gesture={composed}>
            <Animated.Image
              source={{ uri: imageUrl }}
              style={[s.image, animStyle]}
              resizeMode="cover"
            />
          </GestureDetector>

          {/* Crosshair */}
          <View style={s.crossH} pointerEvents="none" />
          <View style={s.crossV} pointerEvents="none" />
          <View style={s.crossDot} pointerEvents="none" />
        </View>

        {/* Save */}
        <View style={[s.footer, { paddingBottom: insets.bottom + 20 }]}>
          <Pressable
            onPress={handleSave}
            style={[s.saveBtn, saving && s.saveBtnDisabled]}
            disabled={saving}
          >
            <Text style={s.saveBtnText}>{saving ? "SAVING…" : "SAVE FOCAL POINT"}</Text>
          </Pressable>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const CROSS_GAP = 60;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#080808" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerBtn: { minWidth: 60 },
  title: {
    color: "#EDE8DC",
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "700",
  },
  cancelText: { color: "#888", fontSize: 14 },
  resetText: { color: "#F0A015", fontSize: 14, textAlign: "right" },

  hint: {
    color: "#666",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  canvas: {
    width: CONT_W,
    height: CONT_H,
    overflow: "hidden",
    position: "relative",
    alignSelf: "center",
  },
  image: { width: CONT_W, height: CONT_H },

  crossH: {
    position: "absolute",
    top: CONT_H / 2,
    left: CONT_W / 2 - CROSS_GAP,
    right: CONT_W / 2 - CROSS_GAP,
    height: 1,
    backgroundColor: "rgba(240,160,21,0.85)",
    pointerEvents: "none",
  },
  crossV: {
    position: "absolute",
    left: CONT_W / 2,
    top: CONT_H / 2 - CROSS_GAP,
    bottom: CONT_H / 2 - CROSS_GAP,
    width: 1,
    backgroundColor: "rgba(240,160,21,0.85)",
    pointerEvents: "none",
  },
  crossDot: {
    position: "absolute",
    top: CONT_H / 2 - 4,
    left: CONT_W / 2 - 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F0A015",
    pointerEvents: "none",
  },

  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
  },
  saveBtn: {
    backgroundColor: "#F0A015",
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: {
    color: "#080808",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.5,
  },
});
