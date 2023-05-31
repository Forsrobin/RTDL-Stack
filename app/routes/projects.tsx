import CollaboratSVG from '@app/assets/svg/Collaborat'
import PageWrapper from '@app/components/PageWrapper'
import { db } from '@app/utils/db.server'
import { getUser } from '@app/utils/session.server'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import type { FC } from 'react'

interface ProjectsProps {}

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request)

  const projects = await db.project.findMany({
    where: {
      ownerId: user?.id
    }
  })

  return json({
    projects: projects
  })
}

const NoProjects = () => {
  return (
    <div className='mw-96 h-96 text-center'>
      <CollaboratSVG />
      <h2 className='text text-base-content text-xl my-10'>No projects available</h2>
      <Link to='/projects/create'>
        <button className='btn btn-primary'>Create a new project</button>
      </Link>
    </div>
  )
}

const Projects: FC<ProjectsProps> = ({}) => {
  const { projects } = useLoaderData<typeof loader>()

  if (projects.length === 0) {
    return (
      <PageWrapper>
        <NoProjects />
      </PageWrapper>
    )
  }

  return (
    <div className='p-10 flex gap-5 flex-col'>
      {projects.map((project) => {
        return (
          <div key={project.id} className='card bordered shadow-lg bg-base-100'>
            <div className='card-body'>
              <h2 className='card-title'>{project.name}</h2>
              <p className='card-subtitle '>{new Date(project.createdAt).toDateString()}</p>
              <Link to={`/projects/${project.id}`}>
                <button className='btn btn-primary'>Open project</button>
              </Link>
            </div>
          </div>
        )
      })}
      <Link to='/projects/create'>
        <button className='btn btn-primary'>Create a new project</button>
      </Link>
    </div>
  )
}

export default Projects
