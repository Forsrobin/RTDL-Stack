import type { CreateProjectType } from '@app/routes/projects_.create'
import { db } from '@app/utils/db.server'
import { getUserId } from '@app/utils/session.server'

export const createProject = async ({ request, project }: { request: Request; project: CreateProjectType }) => {
  const userId = await getUserId(request)

  if (!userId) return null

  const createdProject = await db.project.create({
    data: {
      name: project.name,
      owner: {
        connect: {
          id: userId
        }
      }
    }
  })

  if (!project) return null
  
  return createdProject
}
