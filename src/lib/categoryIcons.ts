import {
  Baby, Bone, Brain, Droplet, HeartPulse, ScanLine, Siren, Stethoscope, Syringe, Wind,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "./protocols";

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Trauma:     Siren,
  Cardiac:    HeartPulse,
  Lung:       Wind,
  "OB/GYN":   Baby,
  Abdominal:  Stethoscope,
  Vascular:   Droplet,
  Neuro:      Brain,
  Thyroid:    ScanLine,
  MSK:        Bone,
  Procedural: Syringe,
};
