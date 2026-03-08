import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AddServiceStepForm } from "@/modules/services/AddServiceStepForm";
import { partnerServices, type PartnerService } from "@/data/partner-mock";

export function PartnerServiceForm({ serviceId }: { serviceId?: string }) {
  const navigate = useNavigate();

  const initialData = React.useMemo(
    () => (serviceId ? partnerServices.find((service) => service.id === serviceId) ?? null : null),
    [serviceId]
  );

  React.useEffect(() => {
    if (serviceId && !initialData) {
      navigate("/services", { replace: true });
    }
  }, [serviceId, initialData, navigate]);

  const handleSave = (payload: Omit<PartnerService, "id"> & { id?: string }) => {
    if (payload.id) {
      const existingIndex = partnerServices.findIndex((service) => service.id === payload.id);
      if (existingIndex !== -1) {
        partnerServices[existingIndex] = { ...(payload as PartnerService) };
      }
    } else {
      partnerServices.unshift({
        ...(payload as Omit<PartnerService, "id">),
        id: `svc-${Date.now()}`,
      });
    }
    navigate("/services");
  };

  return (
    <AddServiceStepForm
      initialData={initialData}
      onBack={() => navigate("/services")}
      onSave={handleSave}
    />
  );
}
