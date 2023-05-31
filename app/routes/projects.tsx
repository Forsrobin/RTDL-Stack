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

const ifDateIsClose = (date: Date) => {
  const now = new Date()
  const diff = Math.abs(date.getTime() - now.getTime())
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24))
  return diffDays < 7
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
      <div>
        {projects.map((project) => {
          return (
            <div key={project.id} className='card mw-96 bg-base-100 shadow-xl'>
              <figure>
                <div className='avatar placeholder flex grow h-32'>
                  <div className='bg-neutral-focus grow text-neutral-content'>
                    <div className='card-actions justify-end absolute top-3 left-3'>
                      <div className='badge badge-outline'>Fashion</div>
                      <div className='badge badge-outline'>Products</div>
                    </div>
                    <span className='text-3xl'>{project.name.charAt(0).toUpperCase() + project.name.slice(1)}</span>
                  </div>
                </div>
              </figure>
              <div className='card-body'>
                <h2 className='card-title'>
                  Shoes!
                  <div className='badge badge-neutral'>{ifDateIsClose(new Date(project.createdAt)) ? 'New' : null}</div>
                </h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <Link to={`/projects/${project.id}`}>
                  <button className='btn btn-primary mt-5 w-full'>Open Project</button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      <Link to='/projects/create'>
        <button className='btn btn-ghost btn-outline'>Create a new project</button>
      </Link>
    </div>
  )
}

export default Projects
