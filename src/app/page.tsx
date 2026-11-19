import {
  getProfileData,
  getProjectsData,
  getSkillsData,
  getTimelineData,
  getSettingsData,
} from "@/lib/data-service";
import PortfolioClient from "@/components/PortfolioClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, projects, skills, timeline, settings] = await Promise.all([
    getProfileData(),
    getProjectsData(true),
    getSkillsData(true),
    getTimelineData(),
    getSettingsData(),
  ]);

  return (
    <PortfolioClient
      initialProfile={profile}
      initialProjects={projects}
      initialSkills={skills}
      initialTimeline={timeline}
      initialSettings={settings}
    />
  );
}
