import { toast } from 'react-toastify'
import { SuccessToast, ErrorToast, LogoutToast } from '../components/common/CustomToast.jsx'
import logo from '../assets/svg/toast/logo.svg'

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
  bodyClassName: 'custom-toast-body',
  icon: false // Disable default react-toastify icons
}

// Toast helper functions with optional parameters
export const showSuccessToast = (message, options = {}) => {
  const { title, icon, showIcon = true, isAuth = false } = options;
  
  // For non-auth toasts, use Talaam as default title and logo as default icon
  // For auth toasts, use provided title/icon or keep default behavior
  const defaultTitle = isAuth ? (title || undefined) : (title || "Talaam");
  const defaultIcon = isAuth ? (icon || undefined) : (icon || logo);
  
  toast.success(
    <SuccessToast 
      message={message} 
      title={defaultTitle}
      icon={defaultIcon}
      showIcon={showIcon}
    />, 
    {
      ...toastConfig,
      className: 'custom-toast-success',
      icon: false // Disable default icon
    }
  )
}

export const showErrorToast = (message, options = {}) => {
  const { title, icon, showIcon = true, isAuth = false } = options;
  
  // For non-auth toasts, use Talaam as default title and logo as default icon
  // For auth toasts, use provided title/icon or keep default behavior
  const defaultTitle = isAuth ? (title || undefined) : (title || "Talaam");
  const defaultIcon = isAuth ? (icon || undefined) : (icon || logo);
  
  toast.error(
    <ErrorToast 
      message={message} 
      title={defaultTitle}
      icon={defaultIcon}
      showIcon={showIcon}
    />, 
    {
      ...toastConfig,
      className: 'custom-toast-error',
      icon: false // Disable default icon
    }
  )
}

export const showLogoutToast = (message, options = {}) => {
  const { title, icon, showIcon = true } = options;
  
  toast.error(
    <LogoutToast 
      message={message} 
      title={title}
      icon={icon}
      showIcon={showIcon}
    />, 
    {
      ...toastConfig,
      className: 'custom-toast-error',
      icon: false // Disable default icon
    }
  )
}