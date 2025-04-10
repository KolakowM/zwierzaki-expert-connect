
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Twitch 
} from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

export const socialMediaInputs = [
  { name: "facebook", label: "Facebook", icon: <Facebook className="mr-2 h-4 w-4 text-blue-600" /> },
  { name: "instagram", label: "Instagram", icon: <Instagram className="mr-2 h-4 w-4 text-pink-600" /> },
  { name: "twitter", label: "Twitter", icon: <Twitter className="mr-2 h-4 w-4 text-blue-400" /> },
  { name: "linkedin", label: "LinkedIn", icon: <Linkedin className="mr-2 h-4 w-4 text-blue-700" /> },
  { name: "youtube", label: "YouTube", icon: <Youtube className="mr-2 h-4 w-4 text-red-600" /> },
  { name: "tiktok", label: "TikTok", icon: <div className="mr-2 h-4 w-4">TT</div> },
  { name: "twitch", label: "Twitch", icon: <Twitch className="mr-2 h-4 w-4 text-purple-600" /> }
];

interface SocialMediaInputsProps {
  form: UseFormReturn<any>;
}

export function SocialMediaInputs({ form }: SocialMediaInputsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Media społecznościowe</h3>
      <div className="space-y-4">
        {socialMediaInputs.map((social) => (
          <FormField
            key={social.name}
            control={form.control}
            name={`socialMedia.${social.name}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  {social.icon}
                  {social.label}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={`https://${social.name}.com/twojprofil`} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
