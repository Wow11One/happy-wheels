import { CrossIcon } from '../components/Icons';
import { useOutsideClick } from '../hooks/dom.hooks';
import { FC, HTMLAttributes, ReactNode, useEffect } from 'react';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: (...args: any[]) => any;
  onProcess?: (...args: any[]) => any;
  title?: string;
  titleClassName?: string;
  actions?: ReactNode;
  closeOnOutsideClick?: boolean;
  allowClose?: boolean;
}

const Modal: FC<ModalProps> = ({
  title,
  className,
  titleClassName,
  onClose,
  children,
  actions,
  closeOnOutsideClick = true,
  allowClose = true,
  ...props
}) => {
  const ref = useOutsideClick(() => onClose?.());

  useEffect(() => {
    const body = document.querySelector('body');

    if (body) {
      body.style.overflow = 'hidden';

      return () => {
        body.style.overflow = 'auto';
      };
    }
  }, []);

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-dark-primary bg-opacity-20 flex flex-col items-center justify-center z-[100] modal box-border'>
      <div
        className={`max-h-[80%] relative box-border flex flex-col w-full ${className}`}
        {...props}
      >
        <div
          className='bg-grey-tertiary backdrop-blur-xl rounded-[4rem] bg-opacity-20 relative w-full flex flex-col px-16 py-10 box-border max-h-full border border-stone-100 border-opacity-10'
          {...(closeOnOutsideClick && { ref })}
        >
          <div className='relative flex flex-col max-h-full'>
            <div className='flex items-center text-white'>
              {!!title?.length && (
                <h3
                  className={`text-3xl font-[700] font-mono flex-1 text-center px-12 ${titleClassName}`}
                >
                  {title}
                </h3>
              )}
              {allowClose && (
                <CrossIcon
                  className='absolute right-0 transition-all duration-300 cursor-pointer size-12 hover:text-green-primary'
                  onClick={() => onClose?.()}
                />
              )}
            </div>
            <div className='relative flex flex-col flex-1 overflow-y-scroll pe-5 -me-5 with-scrollbar modal-content'>
              {children}
            </div>

            <div>{actions}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
