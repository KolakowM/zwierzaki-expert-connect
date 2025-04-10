
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon, YoutubeIcon, TwitchIcon } from "lucide-react";
import { ReactNode } from "react";

export function useProfileSocialIcons() {
  const socialMediaIcons: Record<string, { icon: ReactNode; label: string }> = {
    facebook: { icon: <FacebookIcon className="h-5 w-5 text-blue-600" />, label: "Facebook" },
    instagram: { icon: <InstagramIcon className="h-5 w-5 text-pink-600" />, label: "Instagram" },
    twitter: { icon: <TwitterIcon className="h-5 w-5 text-blue-400" />, label: "Twitter" },
    linkedin: { icon: <LinkedinIcon className="h-5 w-5 text-blue-700" />, label: "LinkedIn" },
    youtube: { icon: <YoutubeIcon className="h-5 w-5 text-red-600" />, label: "YouTube" },
    tiktok: { icon: <div className="h-5 w-5 flex items-center justify-center">TikTok</div>, label: "TikTok" },
    twitch: { icon: <TwitchIcon className="h-5 w-5 text-purple-600" />, label: "Twitch" }
  };
  
  return socialMediaIcons;
}
