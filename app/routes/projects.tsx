import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import type { FC } from 'react'
import CollaboratSVG from '~/assets/svg/Collaborat'
import { db } from '~/utils/db.server'
import { getUser } from '~/utils/session.server'
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
    <div className='flex grow p-10 items-center justify-center'>
      <div className='mw-96 h-96 text-center'>
        <CollaboratSVG />
        <h2 className='text text-base-content text-xl my-10'>No projects available</h2>
        <button className='btn btn-primary'>
          <Link to='/projects/create'>Create a new project</Link>
        </button>
      </div>
    </div>
  )
}

const Projects: FC<ProjectsProps> = ({}) => {
  const { projects } = useLoaderData<typeof loader>()

  if (projects.length === 0) {
    return <NoProjects />
  }

  return (
    <>
      <p>Hello</p>
    </>
  )
}

export default Projects
