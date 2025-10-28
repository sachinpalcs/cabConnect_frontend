import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
        <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-600">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line>
    </svg>
);

const HelpCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-green-600">
        <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path>
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-500">
        <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-900">
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);


const ContactUs = () => {
    const [copyButtonText, setCopyButtonText] = useState('Copy Template');
    const [openSection, setOpenSection] = useState(null);

    const emailTemplate = `
Subject: New Driver Application

Vehicle ID: [Your Vehicle Registration Number]
Owner Name: [Your Full Name]
Mobile Number: [Your 10-Digit Mobile Number]
Email Address: [The email you signed up with CabConnect]
    `.trim();

    const copyEmailTemplate = () => {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = emailTemplate;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        try {
            document.execCommand('copy');
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy Template'), 2000);
        } catch (err)
 {
            console.error('Failed to copy text: ', err);
            setCopyButtonText('Failed to Copy');
        }
        document.body.removeChild(tempTextArea);
    };

    const handleToggleSection = (section) => {
        if (openSection === section) {
            setOpenSection(null);
        } else {
            setOpenSection(section);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto"> {/* Changed max-width for better accordion layout */}
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Contact Us
                </h1>
                <p className="text-center text-lg text-gray-600 mb-12">
                    We're here to help. Choose the option below that best fits your needs.
                </p>

                {/* New Accordion Layout */}
                <div className="space-y-4">
                    
                    {/* Section 1: Become a Driver */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Accordion Header */}
                        <button
                            onClick={() => handleToggleSection('driver')}
                            className="flex justify-between items-center w-full p-6 text-left"
                            aria-expanded={openSection === 'driver'}
                            aria-controls="driver-content"
                        >
                            <div className="flex items-center space-x-3">
                                <UserPlusIcon />
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Become a Driver
                                </h2>
                            </div>
                            <span>
                                {openSection === 'driver' ? <MinusIcon /> : <PlusIcon />}
                            </span>
                        </button>

                        {/* Accordion Content */}
                        <div
                            id="driver-content"
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                openSection === 'driver' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="border-t border-gray-200">
                                <div className="p-6">
                                    <p className="text-gray-600 mb-6">
                                        Interested in driving with CabConnect? Contact our driver operations team.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-700">
                                            <MailIcon />
                                            <a href="mailto:drivers@cabconnect.com" className="hover:text-blue-600">drivers@cabconnect.com</a>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <PhoneIcon />
                                            <div>
                                                <span>+91 12345 67890</span>
                                                <p className="text-sm text-gray-500">(10:00 AM to 8:00 PM, Mon-Fri)</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Email Format Section */}
                                    <div className="mt-6 pt-6 border-t border-dashed">
                                        <h3 className="text-md font-semibold text-gray-700 mb-2">Email Format for Application:</h3>
                                        <p className="text-sm text-gray-500 mb-3">
                                            To speed up your application, please send us an email with the following details:
                                        </p>
                                        <pre className="bg-gray-50 p-4 rounded-md text-sm text-gray-800 whitespace-pre-wrap font-sans border border-gray-200">
                                            {emailTemplate}
                                        </pre>
                                        <button
                                            onClick={copyEmailTemplate}
                                            className="mt-3 w-full text-sm py-2 px-4 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                                        >
                                            {copyButtonText}
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50 border-t">
                                    <a 
                                        href="mailto:drivers@cabconnect.com?subject=New%20Driver%20Application"
                                        className="block w-full text-center py-3 px-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
                                    >
                                        Email Driver Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: General Support */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Accordion Header */}
                        <button
                            onClick={() => handleToggleSection('support')}
                            className="flex justify-between items-center w-full p-6 text-left"
                            aria-expanded={openSection === 'support'}
                            aria-controls="support-content"
                        >
                            <div className="flex items-center space-x-3">
                                <HelpCircleIcon />
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    General Support
                                </h2>
                            </div>
                            <span>
                                {openSection === 'support' ? <MinusIcon /> : <PlusIcon />}
                            </span>
                        </button>

                        {/* Accordion Content */}
                        <div
                            id="support-content"
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                openSection === 'support' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="border-t border-gray-200">
                                <div className="p-6">
                                    <p className="text-gray-600 mb-6">
                                        For any ride issues, payment problems, or other questions, contact our support team.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-700">
                                            <MailIcon />
                                            <a href="mailto:support@cabconnect.com" className="hover:text-green-600">support@cabconnect.com</a>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <PhoneIcon />
                                            <div>
                                                <span>+91 09876 54321</span>
                                                <p className="text-sm text-gray-500">(24x7 Support Available)</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 pt-6 mt-6 border-t border-dashed">
                                            You can also find help in our app or visit our <Link to="/faq" className="text-green-600 font-medium hover:underline">FAQ page</Link> for common questions.
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50 border-t">
                                    <a 
                                        href="mailto:support@cabconnect.com?subject=Support%20Request"
                                        className="block w-full text-center py-3 px-4 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700"
                                    >
                                        Email General Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactUs;

