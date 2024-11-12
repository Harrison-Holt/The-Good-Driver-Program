import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppSelector } from '../../store/hooks';
import { selectUserType } from '../../store/userSlice';

const FAQ: React.FC = () => {
    const userType = useAppSelector(selectUserType);

    const faqs = [
        {
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login page and click 'Forgot Password'. You will receive an email with instructions on how to reset your password."
        },
        {
        question: "How can I change my email address?",
        answer: "To change your email address, go to your profile settings, click the Edit Profile button and enter your new email, and confirm the change. You may need to verify your new email address."
        },
        {
        question: "Where can I view my points balance?",
        answer: "You can view your points balance on your dashboard. It’s displayed in the navigation bar on the top right of the screen. You should see a section for 'Points.'"
        },
        {
        question: "How do I enable notifications when my points change?",
        answer: "To enable notifications when your points change, go to your profile and toggle the 'Receive notifications' option. This will allow you to receive email notifications for specific updates."
        },
        {
        question: "What is the purpose of this platform?",
        answer: "This platform allows sponsors and drivers to track their performance and rewards, providing a view of points and achievements and the ability to purchase products with those points."
        }
    ];

    if (userType !== "driver"){
        return null;
    }

    return (
        <Box sx={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
            Frequently Asked Questions
        </Typography>
        {faqs.map((faq, index) => (
            <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>{faq.answer}</Typography>
            </AccordionDetails>
            </Accordion>
        ))}
        </Box>
    );
};

export default FAQ;
