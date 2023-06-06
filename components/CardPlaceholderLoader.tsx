import { css } from '@emotion/css';

const widthImagePlaceholder = '33.333333%'
const widthTitlePlaceholder = '7rem'
const widthDescriptionPlaceholder = '12rem'
const backgroundColor = 'var(--c-lightgrey)' 

export const CardPlaceholder = () => {
  
  return (
    <div className={css`
                      display: flex;
                      overflow: hidden;
                      flex-direction: column;
                      border-radius: 0.5rem;
                      border-width: 1px;
                      border-color: #e5e7eb;

                      @media (min-width: 768px) {
                        flex-direction: row;
                      }
                    `}>
      <div className={css`
                        background-color: ${backgroundColor};
                        width: 100%;

                        @media (min-width: 768px) {
                          flex: none;
                          width: ${widthImagePlaceholder};
                          height: auto;
                        }
                      `}/>
      <div className={css`
                        display: grid;
                        position: relative;
                        padding: 2.5rem;
                        gap: 1.25rem;
                      `} >
        <div className={css`
                          background-color: ${backgroundColor};
                          width: ${widthTitlePlaceholder};
                          height: 2.5rem;
                          border-radius: 0.375rem;
                        `}/>
        <div className={css`
                          background-color: ${backgroundColor};
                          width: ${widthDescriptionPlaceholder};
                          height: 1.5rem;
                          border-radius: 0.375rem;
                        `}/>
        <div className={css`
                          background-color: ${backgroundColor};
                          width: ${widthDescriptionPlaceholder};
                          height: 1.5rem;
                          border-radius: 0.375rem;
                        `}/>
        <div className={css`
                          background-color: ${backgroundColor};
                          width: ${widthDescriptionPlaceholder};
                          height: 1.5rem;
                          border-radius: 0.375rem;
                        `}/>
      </div>
    </div>
  )
}

export const CardLoader = () => {
  return (
    <>
      {[0, 1].map((i) => (
        <div key={i} className={css`
                  display: flex; 
                  overflow: hidden; 
                  flex-direction: column; 
                  border-radius: 0.5rem; 
                  border-width: 1px; 
                  border-color: #E5E7EB; 

                  @media (min-width: 768px) { 
                    flex-direction: row; 
                  }
                `}>
          <div className={css`
                    position: relative; 
                    background-color: ${backgroundColor}; 
                    width: 100%; 
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

                    @keyframes pulse {
                      0%, 100% {
                        opacity: 1;
                      }
                      50% {
                        opacity: .5;
                      }
                    }; 

                    @media (min-width: 768px) { 
                      flex: none; 
                      width: ${widthImagePlaceholder}; 
                      height: auto; 
                    }
                  `} />
          <div className={css`
                    display: grid;
                    position: relative;
                    padding: 2.5rem;
                    gap: 1.25rem;
                  `} >
            <div className={css`
                      background-color: ${backgroundColor};
                      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

                      @keyframes pulse {
                        0%,
                        100% {
                          opacity: 1;
                        }
                        50% {
                          opacity: 0.5;
                        }
                      }
                      width: ${widthTitlePlaceholder};
                      height: 2.5rem;
                      border-radius: 0.375rem;
                    `} />
            <div className={css`
                      background-color: ${backgroundColor};
                      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

                      @keyframes pulse {
                        0%,
                        100% {
                          opacity: 1;
                        }
                        50% {
                          opacity: 0.5;
                        }
                      }
                      width: ${widthDescriptionPlaceholder};
                      height: 1.5rem;
                      border-radius: 0.375rem;
                    `} />
            <div className={css`
                      background-color: ${backgroundColor};
                      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

                      @keyframes pulse {
                        0%,
                        100% {
                          opacity: 1;
                        }
                        50% {
                          opacity: 0.5;
                        }
                      }
                      width: ${widthDescriptionPlaceholder};
                      height: 1.5rem;
                      border-radius: 0.375rem;
                    `} />
            <div className={css`
                      background-color: ${backgroundColor};
                      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

                      @keyframes pulse {
                        0%,
                        100% {
                          opacity: 1;
                        }
                        50% {
                          opacity: 0.5;
                        }
                      }
                      width: ${widthDescriptionPlaceholder};
                      height: 1.5rem;
                      border-radius: 0.375rem;
                    `} />
          </div>
        </div>
      ))}
    </>
  )
}