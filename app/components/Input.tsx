import type { FC } from 'react'
import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

interface InputProps {
  fieldError?: any
  field?: any
  formName: string
  placeholder?: string
  showPasswordOption?: boolean
  type: string
  formLabel: string
}

const Input: FC<InputProps> = ({ field, fieldError, formName, placeholder, showPasswordOption, type, formLabel }) => {
  const [displayPassword, setDisplayPassword] = useState<boolean>(false)

  return (
    <div>
      <div className='form-control relative'>
        <label className='label'>
          <span className='label-text'>{formLabel}</span>
        </label>
        <div className='flex relative'>
          <input
            type={displayPassword ? 'text' : type}
            className={'input input-bordered grow w-full' + (fieldError ? 'input-error' : '')}
            name={formName}
            placeholder={placeholder || ''}
            defaultValue={field}
          />
          {showPasswordOption ? (
            <button
              type='button'
              onClick={() => setDisplayPassword(!displayPassword)}
              className='btn text-xl text-accent-content btn-ghost absolute right-0'>
              {displayPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <label className='label '>
        {fieldError ? (
          <span className='label-text text-error' role='alert' id='username-error'>
            {fieldError}
          </span>
        ) : null}
      </label>
    </div>
  )
}

export default Input
