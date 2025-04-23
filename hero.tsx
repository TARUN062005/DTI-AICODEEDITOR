import styled from "styled-components"

const HeroContainer = styled.div`
  /* Styles for the hero container */
  padding: 4rem;
  text-align: center;
`

const Title = styled.h1`
  /* Styles for the title */
  font-size: 2.5rem;
  margin-bottom: 1rem;
`

const Subtitle = styled.p`
  /* Styles for the subtitle */
  font-size: 1.2rem;
  color: #666;
`

const CTA = styled.div`
  /* Styles for the CTA section */
  margin-top: 2rem;
`

const Button = styled.button`
  /* Styles for the button */
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;

  &:hover {
    background-color: #0056b3;
  }
`

const Hero = () => {
  return (
    <HeroContainer>
      <Title>Welcome to our platform</Title>
      <Subtitle>Discover amazing things.</Subtitle>
      <CTA>
        <Button>Get Started</Button>
      </CTA>
    </HeroContainer>
  )
}

export default Hero
