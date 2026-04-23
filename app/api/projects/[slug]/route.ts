import { getProjectBySlug } from "@/app/actions/projects";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NotFoundError } from "@/lib/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return successResponse(project);
  } catch (error) {
    return errorResponse(error);
  }
}
