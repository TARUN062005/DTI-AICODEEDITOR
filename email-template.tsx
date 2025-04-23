import { Body, Container, Content, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"
import { Footer } from "./footer"

interface EmailProps {
  name: string
}

export default function Email({ name }: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from your portfolio</Preview>
      <Tailwind>
        <Body className="bg-white text-black">
          <Container>
            <Section className="mt-10">
              <Img
                src="https://res.cloudinary.com/dadsf3onz/image/upload/v1691784938/portfolio/email-template-hero_hjw9ho.png"
                alt="Hero Image"
                className="w-full"
              />
            </Section>
            <Heading className="text-center text-2xl font-bold">Hi {name},</Heading>
            <Text className="text-center">Thanks for reaching out! I'm excited to connect with you.</Text>
            <Hr />
            <Content>
              <Footer />
            </Content>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
