import React from 'react'

const SignUpFree = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8" style={{ width: '505px', height: '464px' }}>
        {/* Main Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Sign up free
        </h1>
        
        {/* Descriptive Text */}
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Create an account to access thousands of questions and unlock your potential.
        </p>
        
        {/* Sign Up Button */}
        <div className="flex justify-center mb-6">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            Sign up free
          </button>
        </div>
        
        {/* Agreement Text */}
        <p className="text-center text-gray-600 text-xs mb-4">
          By continuing you agree to our{' '}
          <a href="#" className="text-orange-500 font-semibold underline hover:text-orange-600">
            Terms
          </a>
          {' '}and{' '}
          <a href="#" className="text-orange-500 font-semibold underline hover:text-orange-600">
            Privacy
          </a>
        </p>
        
        {/* Login Prompt */}
        <p className="text-center text-gray-600 text-xs">
          Already have an account?{' '}
          <a href="#" className="text-orange-500 font-semibold underline hover:text-orange-600">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignUpFree