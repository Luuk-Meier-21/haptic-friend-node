import { SettingsController } from "../utils/settings";

const settings = new SettingsController(".test-hpf");

const data: string[] = [
    "saaa",
    "sbab",
    "scac"
]

settings.set(data);