"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CollectionPoint } from "@/types/api";
import type { Coordinates } from "@/lib/utils/geolocation";

/**
 * Collection Point Map
 * Interactive map showing collection points and user location
 */

interface CollectionPointMapProps {
  points: CollectionPoint[];
  userLocation?: Coordinates | null;
  selectedPoint?: CollectionPoint | null;
  onPointSelect?: (point: CollectionPoint) => void;
  className?: string;
}

export function CollectionPointMap({
  points,
  userLocation,
  selectedPoint,
  onPointSelect,
  className = "",
}: CollectionPointMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      center: { lat: 0, lng: 0 },
      zoom: 2,
      zoomControl: true,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const userIcon = L.divIcon({
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background: #1f5fa8;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      className: "",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(mapRef.current);

    marker.bindPopup("<strong>Your Location</strong>");

    // Pan to user location
    mapRef.current.setView([userLocation.lat, userLocation.lng], 13);

    return () => {
      marker.remove();
    };
  }, [userLocation]);

  // Update collection point markers
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const currentMarkers = markersRef.current;

    // Remove old markers
    currentMarkers.forEach((marker) => marker.remove());
    currentMarkers.clear();

    // Add new markers
    const located = points.filter(
      (point): point is CollectionPoint & { location: Coordinates } =>
        point.location !== null,
    );
    located.forEach((point) => {
      const isSelected = selectedPoint?.id === point.id;

      const icon = L.divIcon({
        html: `
          <div style="
            width: ${isSelected ? "40px" : "32px"};
            height: ${isSelected ? "40px" : "32px"};
            background: ${isSelected ? "#145238" : "#1b6b4a"};
            border: ${isSelected ? "4px" : "3px"} solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? "20px" : "16px"};
            transition: all 0.2s;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `,
        className: "",
        iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
        iconAnchor: [isSelected ? 20 : 16, isSelected ? 20 : 16],
      });

      const marker = L.marker([point.location.lat, point.location.lng], {
        icon,
        title: point.name,
        alt: point.name,
        zIndexOffset: isSelected ? 500 : 0,
      }).addTo(map);

      // Point names and addresses come from the API, so render them as text.
      const popup = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = point.name;
      const address = document.createElement("p");
      address.textContent = `${point.address}, ${point.city}`;
      popup.append(name, address);
      marker.bindPopup(popup);

      if (onPointSelect) {
        marker.on("click", () => onPointSelect(point));
      }

      currentMarkers.set(point.id, marker);
    });

    // Fit bounds to show all markers
    if (located.length > 0) {
      const bounds = L.latLngBounds(
        located.map((p) => [p.location.lat, p.location.lng]),
      );
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [points, selectedPoint, onPointSelect, userLocation]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Collection point map"
      className={`relative z-0 h-[420px] sm:h-[520px] w-full rounded-xl overflow-hidden border border-[var(--border)] ${className}`}
    />
  );
}
