import { getProjects } from "@/app/actions/projects";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const projects = await getProjects();
    return successResponse(projects);
  } catch (error) {
    return errorResponse(error);
  }
}
