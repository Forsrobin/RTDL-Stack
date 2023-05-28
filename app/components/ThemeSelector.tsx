import { Form, useSubmit } from '@remix-run/react'
import type { FC } from 'react'
import { MdColorLens } from 'react-icons/md'

interface ThemeSelectorProps {
  currentTheme: string
}

const themes = ['light', 'dark', 'cupcake', 'lofi']

const ThemeSelector: FC<ThemeSelectorProps> = ({ currentTheme }) => {
  const submit = useSubmit()
  function handleChange(event: any) {
    submit(event.currentTarget, { replace: false })
  }

  return (
    <div className='dropdown dropdown-end'>
      <label tabIndex={0} className='btn btn-ghost rounded-btn'>
        <MdColorLens className='text-3xl' />
      </label>
      <Form method='post' action='theme' onChange={handleChange}>
        <ul tabIndex={0} className='mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 text-base-content'>
          {themes.map((theme, index) => {
            return (
              <li key={index}>
                <label className='cursor-pointer label label-text'>
                  <input
                    type='radio'
                    name='theme'
                    value={theme}
                    checked={currentTheme === theme}
                    onChange={() => {}}
                    className='radio radio-primary'
                  />
                  <span className='text-s'>{theme}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </Form>
    </div>
  )
}

export default ThemeSelector
