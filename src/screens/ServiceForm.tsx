import * as React from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AddServiceStepForm } from "@/modules/services/AddServiceStepForm";
import { type PartnerService } from "@/data/partner-mock";
import { poojaServicesApi, type PoojaServicePayload } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { usePoojaServices, POOJA_SERVICES_QUERY_KEY } from "@/hooks/usePoojaServices";

export function ServiceForm({ serviceId }: { serviceId?: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { services, isLoading } = usePoojaServices();

  const initialData = React.useMemo(
    () => (serviceId ? services.find((service) => service.id === serviceId) ?? null : null),
    [serviceId, services]
  );

  React.useEffect(() => {
    if (serviceId && !isLoading && !initialData) {
      navigate("/services", { replace: true });
    }
  }, [serviceId, initialData, isLoading, navigate]);

  const createMutation = useMutation({
    mutationFn: (payload: PoojaServicePayload) => poojaServicesApi.create(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: POOJA_SERVICES_QUERY_KEY });
      if (response.data?.activationBlockedByKyc) {
        toast.error("Service was opted, but activation is blocked until KYC is complete");
      } else {
        toast.success("Service opted successfully");
      }
      navigate("/services");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to opt service");
    },
  });

  const handleSave = async (payload: Omit<PartnerService, "id"> & { id?: string }) => {
    if (payload.id) {
      toast.error("Edit service API is not available yet");
      return;
    }

    const requestBody: PoojaServicePayload = {
      name: payload.name.trim(),
      category: payload.category.trim(),
      description: payload.description.trim(),
      duration: payload.duration,
      basePrice: payload.basePrice,
      customPrice: payload.customPrice,
      visitType: payload.visitType,
      requiredItems: payload.requiredItems,
      enabled: user?.isKycVerified ? payload.enabled : false,
      image: payload.image,
      packages: payload.packages
        ?.filter((pkg): pkg is typeof pkg & { name: "Basic" | "Standard" | "Premium" } =>
          pkg.name === "Basic" || pkg.name === "Standard" || pkg.name === "Premium"
        )
        .map((pkg) => ({
          name: pkg.name,
          price: pkg.price,
          description: pkg.description.trim(),
        })),
    };

    await createMutation.mutateAsync(requestBody);
  };

  if (serviceId && isLoading) {
    return null;
  }

  return (
    <AddServiceStepForm
      initialData={initialData}
      onBack={() => navigate("/services")}
      onSave={handleSave}
      isSaving={createMutation.isPending}
    />
  );
}
