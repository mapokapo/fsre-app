import Profile from "@/lib/types/Profile";

export default interface Session {
  token: string;
  profile: Profile;
}
