import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export const WateringControl = () => {
  const [isAutomatic, setIsAutomatic] = useState(false);

  const handleToggle = (enabled: boolean) => {
    setIsAutomatic(enabled);
    toast({
      title: enabled ? "Automatic watering enabled" : "Automatic watering disabled",
      description: enabled
        ? "Your plant will be watered automatically based on soil moisture levels."
        : "You'll need to water your plant manually.",
    });
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Automatic Watering</h3>
          <p className="text-sm text-gray-500">
            Let the system handle watering automatically
          </p>
        </div>
        <Switch
          checked={isAutomatic}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-plant-primary"
        />
      </div>
    </Card>
  );
};