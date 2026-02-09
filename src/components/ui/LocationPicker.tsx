"use client";

import * as React from "react";
import { Map, MapMarker, MapControls, MarkerContent } from "@/components/ui/Map";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Check, Search } from "lucide-react";
import { reverseGeocode } from "@/lib/location";

interface LocationPickerProps {
  address: string;
  position: [number, number];
  onLocationChange: (address: string, position: [number, number]) => void;
  locationType?: string;
  onLocationTypeChange?: (type: string) => void;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  locationData?: {
    latitude?: number;
    longitude?: number;
  } | null;
}

export function LocationPicker({
  address,
  position,
  onLocationChange,
  locationType = "Home",
  onLocationTypeChange,
  isExpanded: isExpandedProp,
  onExpandedChange,
  locationData,
}: LocationPickerProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(false);
  const isExpanded = isExpandedProp !== undefined ? isExpandedProp : internalExpanded;
  const setIsExpanded = (val: boolean) => {
    if (onExpandedChange) onExpandedChange(val);
    else setInternalExpanded(val);
  };
  const [tempAddress, setTempAddress] = React.useState(address);
  const [tempPosition, setTempPosition] = React.useState<[number, number]>(position);
  const [isAddressLoading, setIsAddressLoading] = React.useState(false);
  const prevExpandedRef = React.useRef(isExpanded);

  // Sync temp state when address/position props change
  React.useEffect(() => {
    setTempAddress(address);
    setTempPosition(position);
  }, [address, position]);

  // When collapsing (expanded -> false), persist the latest temp state back to Booking
  React.useEffect(() => {
    if (prevExpandedRef.current && !isExpanded) {
      onLocationChange(tempAddress, tempPosition);
    }
    prevExpandedRef.current = isExpanded;
  }, [isExpanded, onLocationChange, tempAddress, tempPosition]);

  const handleToggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);
  };

  const handleMapClick = (e: any) => {
    const newPos: [number, number] = [e.lngLat.lat, e.lngLat.lng];
    setTempPosition(newPos);
    setIsAddressLoading(true);
    reverseGeocode(newPos[0], newPos[1]).then((data) => {
      if (data) setTempAddress(data.address);
      setIsAddressLoading(false);
    }).catch(() => setIsAddressLoading(false));
  };

  if (!isExpanded) {
    return (
      <div
        onClick={handleToggleExpand}
        className="group relative flex cursor-pointer items-center overflow-hidden bg-white rounded-2xl p-4 border border-slate-100 shadow-sm transition-all hover:ring-1 hover:ring-[#FF9933]/30"
      >
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-slate-200 overflow-hidden">
          <img 
            src="/images/map_dummy.png" 
            alt="Map Preview" 
            className="h-full w-full object-fill opacity-50 transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-navigation text-slate-500/80 drop-shadow-sm"
              aria-hidden="true"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
          </div>
        </div>
        <div className="relative z-10 w-3/4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1 mb-1">
            {locationType}{" "}
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20">
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          </div>
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            {address}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-4 pb-2 border-b border-slate-100 bg-white">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={isAddressLoading ? "Fetching address..." : tempAddress}
              onChange={(e) => setTempAddress(e.target.value)}
              placeholder="Search for your address"
              className={`pr-10 h-12 rounded-xl border-slate-200 focus:ring-[#FF9933] ${isAddressLoading ? "text-slate-400 animate-pulse" : ""}`}
              disabled={isAddressLoading}
            />
            {isAddressLoading ? (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 border-2 border-[#FF9933] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            )}
          </div>

        </div>
      </div>

      <div className="p-4 pt-2 bg-orange-50/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            {["Home", "Temple", "Others"].map((l) => {
              const active = l === locationType;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => onLocationTypeChange?.(l)}
                  className={
                    "rounded-full px-3 py-2 text-xs font-semibold ring-1 transition " +
                    (active
                      ? "bg-[#FF9933]/15 ring-[#FF9933]/35 text-[#B35300]"
                      : "bg-white ring-slate-200 text-slate-700 hover:bg-slate-50")
                  }
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="relative h-64 rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-sm bg-white">
          <Map
            center={[tempPosition[1], tempPosition[0]]}
            zoom={16}
            onClick={handleMapClick}
          >
            <MapControls position="top-right" showZoom showLocate />

            {/* Current Location Marker (Blue Ball) */}
            {locationData?.latitude && locationData?.longitude && (
              <MapMarker
                longitude={locationData.longitude}
                latitude={locationData.latitude}
              >
                <MarkerContent>
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-sm"></span>
                  </div>
                </MarkerContent>
              </MapMarker>
            )}

            {/* Draggable Service Pin */}
            <MapMarker
              draggable
              longitude={tempPosition[1]}
              latitude={tempPosition[0]}
              onDragEnd={(lngLat) => {
                const newPos: [number, number] = [lngLat.lat, lngLat.lng];
                setTempPosition(newPos);
                setIsAddressLoading(true);
                reverseGeocode(newPos[0], newPos[1]).then((data) => {
                  if (data) setTempAddress(data.address);
                  setIsAddressLoading(false);
                }).catch(() => setIsAddressLoading(false));
              }}
            >
              <MarkerContent>
                <div className="cursor-move drop-shadow-md">
                  <MapPin className="fill-[#FF9933] stroke-white" size={32} />
                </div>
              </MarkerContent>
            </MapMarker>
          </Map>
          
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <Badge variant="neutral" className="bg-white/90 backdrop-blur-sm shadow-sm border-none text-[10px]">
              Tap on map to pin
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
