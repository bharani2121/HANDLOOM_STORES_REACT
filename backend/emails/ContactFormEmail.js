const React = require('react');
const { 
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr
} = require('@react-email/components');

const ContactFormEmail = ({ senderEmail, message }) => {
  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(
      Body,
      { style: { backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' } },
      React.createElement(
        Container,
        null,
        React.createElement(
          Section,
          { 
            style: {
              backgroundColor: '#fff',
              padding: '20px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px'
            }
          },
          React.createElement(
            Heading,
            { style: { marginBottom: '10px' } },
            '👕👖 New Inquiry from TrendzWear Website'
          ),
          React.createElement(
            Text,
            null,
            React.createElement('strong', null, 'From:'),
            ' ',
            senderEmail
          ),
          React.createElement(Hr, null),
          React.createElement(Text, null, message)
        )
      )
    )
  );
};

module.exports = ContactFormEmail;