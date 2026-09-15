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
      center: userLocation || { lat: 0, lng: 0 },
      zoom: userLocation ? 13 : 2,
      zoomControl: true,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
          background: #3b82f6;
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
    points.forEach((point) => {
      const isSelected = selectedPoint?.id === point.id;

      const icon = L.divIcon({
        html: `
          <div style="
            width: ${isSelected ? "40px" : "32px"};
            height: ${isSelected ? "40px" : "32px"};
            background: ${isSelected ? "#10b981" : "#22c55e"};
            border: ${isSelected ? "4px" : "3px"} solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? "20px" : "16px"};
            transition: all 0.2s;
          ">
            📍
          </div>
        `,
        className: "",
        iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
        iconAnchor: [isSelected ? 20 : 16, isSelected ? 20 : 16],
      });

      const marker = L.marker([point.location.lat, point.location.lng], {
        icon,
        zIndexOffset: isSelected ? 500 : 0,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif;">
          <strong style="font-size: 14px;">${point.name}</strong>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">${point.address}</p>
          <p style="margin: 4px 0; font-size: 11px; color: #10b981;">
            ${point.operatingHours.open} - ${point.operatingHours.close}
          </p>
        </div>
      `);

      if (onPointSelect) {
        marker.on("click", () => onPointSelect(point));
      }

      currentMarkers.set(point.id, marker);
    });

    // Fit bounds to show all markers
    if (points.length > 0) {
      const bounds = L.latLngBounds(
        points.map((p) => [p.location.lat, p.location.lng])
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
      className={`w-full rounded-lg overflow-hidden ${className}`}
      style={{ height: "400px" }}
    />
  );
}
