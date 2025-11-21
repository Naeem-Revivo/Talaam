import { toast } from 'react-toastify'
import { SuccessToast, ErrorToast, LogoutToast } from '../components/common/CustomToast.jsx'

// Custom toast configuration
export const toastConfig = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  closeButton: false,
  className: 'custom-toast-container',
  bodyClassName: 'custom-toast-body'
}

// Toast helper functions with optional parameters
export const showSuccessToast = (message, options = {}) => {
  const { title, icon, showIcon } = options;
  
  toast.success(
    <SuccessToast 
      message={message} 
      title={title}
      icon={icon}
      showIcon={showIcon}
    />, 
    {
      ...toastConfig,
      className: 'custom-toast-success'
    }
  )
}

export const showErrorToast = (message, options = {}) => {
  const { title, icon, showIcon } = options;
  
  toast.error(
    <ErrorToast 
      message={message} 
      title={title}
      icon={icon}
      showIcon={showIcon}
    />, 
    {
      ...toastConfig,
      className: 'custom-toast-error'
    }
  )
}

export const showLogoutToast = (message, options = {}) => {
  const { title, icon, showIcon } = options;
  
  toast.success(
    <LogoutToast 
      message={message} 
      title={title}
      icon={icon}
      showIcon={showIcon}
    />, 
    {
      ...toastConfig,
      className: 'custom-toast-success'
    }
  )
}