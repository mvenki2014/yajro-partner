import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { poojaServicesApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { PartnerService } from "@/data/partner-mock";

export const POOJA_SERVICES_QUERY_KEY = ["pooja-services"];

export function usePoojaServices() {
  const { user } = useAuth();

  const query = useQuery<PartnerService[]>({
    queryKey: POOJA_SERVICES_QUERY_KEY,
    queryFn: async () => {
      const response = await poojaServicesApi.list();
      return (response.data || []) as PartnerService[];
    },
    enabled: !!user?.id,
  });

  const services = useMemo(() => {
    if (!user?.id) {
      return [];
    }

    return (query.data || []).filter((service) => service.poojariId === user.id);
  }, [query.data, user?.id]);

  return {
    ...query,
    services,
  };
}
