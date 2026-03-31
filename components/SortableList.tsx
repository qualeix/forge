import React, { useEffect, useRef, useState } from "react";
import {
  LayoutAnimation,
  PanResponder,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

// ─── Double Chevron Icon ──────────────────────────────────────────────────────

function DoubleChevron() {
  return (
    <View style={{ alignItems: "center", gap: 1 }}>
      <Ionicons name="chevron-up" size={11} color={theme.colors.muted} />
      <Ionicons name="chevron-down" size={11} color={theme.colors.muted} />
    </View>
  );
}

// ─── Handle ──────────────────────────────────────────────────────────────────

interface DraggableHandleProps {
  onDragStart: () => void;
  onDragMove: (dy: number) => void;
  onDragEnd: () => void;
}

export function DraggableHandle({
  onDragStart,
  onDragMove,
  onDragEnd,
}: DraggableHandleProps) {
  const cb = useRef({ onDragStart, onDragMove, onDragEnd });
  cb.current = { onDragStart, onDragMove, onDragEnd };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => cb.current.onDragStart(),
      onPanResponderMove: (_, { dy }) => cb.current.onDragMove(dy),
      onPanResponderRelease: () => cb.current.onDragEnd(),
      onPanResponderTerminate: () => cb.current.onDragEnd(),
    })
  ).current;

  return (
    <View
      {...pan.panHandlers}
      hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <DoubleChevron />
    </View>
  );
}

// ─── Sortable List ───────────────────────────────────────────────────────────

interface SortableItem {
  id: string;
}

interface SortableListProps<T extends SortableItem> {
  data: T[];
  onReorder: (newIds: string[]) => void;
  renderRow: (item: T, handle: React.ReactNode) => React.ReactNode;
  rowBackground?: string;
}

export function SortableList<T extends SortableItem>({
  data,
  onReorder,
  renderRow,
  rowBackground = theme.colors.card,
}: SortableListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localData, setLocalData] = useState<T[]>(data);

  // Sync with external data when not dragging
  useEffect(() => {
    if (!activeId) setLocalData(data);
  }, [data, activeId]);

  // Refs for use inside PanResponder callbacks (avoid stale closures)
  const orderRef = useRef<T[]>(data);
  const activeRef = useRef<string | null>(null);
  const startIdx = useRef(0);
  const rowH = useRef(48);
  const hMap = useRef<Record<string, number>>({});

  // Keep refs in sync
  orderRef.current = activeId ? localData : data;
  activeRef.current = activeId;

  const onDragStart = (index: number) => {
    const items = [...data];
    const item = items[index];
    if (!item) return;

    startIdx.current = index;
    rowH.current = hMap.current[item.id] ?? 48;
    orderRef.current = items;
    activeRef.current = item.id;

    setActiveId(item.id);
    setLocalData(items);
  };

  const onDragMove = (_: number, dy: number) => {
    const id = activeRef.current;
    if (!id) return;

    const h = rowH.current;
    const order = orderRef.current;
    const target = Math.max(
      0,
      Math.min(order.length - 1, startIdx.current + Math.round(dy / h))
    );
    const curIdx = order.findIndex((d) => d.id === id);
    if (curIdx === target) return;

    // Animate the layout transition
    LayoutAnimation.configureNext({
      duration: 150,
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    });

    const next = [...order];
    const [moved] = next.splice(curIdx, 1);
    next.splice(target, 0, moved);

    orderRef.current = next;
    setLocalData(next);
  };

  const onDragEnd = () => {
    const finalIds = orderRef.current.map((d) => d.id);
    activeRef.current = null;
    setActiveId(null);
    onReorder(finalIds);
  };

  // Use localData during drag, external data otherwise
  const items = activeId ? localData : data;

  return (
    <View>
      {items.map((item, index) => {
        const isActive = item.id === activeId;
        const isLast = index === items.length - 1;

        return (
          <View
            key={item.id}
            onLayout={(e) => {
              hMap.current[item.id] = e.nativeEvent.layout.height;
            }}
            style={
              isActive
                ? {
                    zIndex: 999,
                    elevation: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }
                : undefined
            }
          >
            <View
              style={{
                backgroundColor: isActive
                  ? theme.colors.cardElevated
                  : rowBackground,
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomColor: theme.colors.border,
              }}
            >
              {renderRow(
                item,
                <DraggableHandle
                  onDragStart={() => onDragStart(index)}
                  onDragMove={(dy) => onDragMove(index, dy)}
                  onDragEnd={() => onDragEnd()}
                />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
