import video from "../assets/SampleVideo_720x480_5mb.mp4";
import { Button } from "reactstrap";

export default function About() {
  const signin = () => {
    window.location = "/api/auth/login/google";
  };

  return (
    <div>
      <div className="hero">
        <div className="hero-inner">
          <div className="sub1">
            <img src="https://images.pexels.com/photos/332090/pexels-photo-332090.jpeg" />
          </div>
          <div className="sub2">
            <h1>Secret Chaperone</h1>
            <h2>Your dating lifeline...</h2>
          </div>
        </div>
      </div>
      <div className="title-split-container">
        <h2>See How It Works</h2>
        <div className="inner-title-split-container">
          <div className="sub1">
            <List
              items={[
                "Add an Event",
                "Pick some Contacts",
                "Check In",
                "Enjoy Yourself",
              ]}
            />
          </div>
          <div className="sub2 video-container">
            <video src={video} muted autoPlay controls></video>
          </div>
        </div>
      </div>
      <div className="testimonials">
        <div className="testimonial">
          <div className="quote">
            <h2>
              As a single mother, Secret Chaperone gives my daughter the
              independence she needs as she goes off to college and the
              peace-of-mind I need without violating her privacy.
            </h2>
          </div>
          <h3>- Samantha</h3>
        </div>

        <div className="testimonial">
          <div className="quote">
            <h2>
              Blind dating has always scared me. With Secret Chaperone, I can
              finally put myself out there to meet my special someone.
            </h2>
          </div>
          <h3>- Hillary</h3>
        </div>

        <div className="testimonial">
          <div className="quote">
            <h2>
              I use Secret Chaperone because I like mountain biking. My friends
              getting notified when I don't check in because of some injury can
              literally be a life saver.
            </h2>
          </div>
          <h3>- Calvin</h3>
        </div>
      </div>
      <div className="call-to-action">
        <h2>Get Started Today!</h2>
        <Button color="primary" size="lg" onClick={signin}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}

function List({ items }) {
  const formattedItems = items.map((x, i) => {
    return (
      <div className="list-item" key={i}>
        <div className="list-item-number">
          <span>{i + 1}</span>
        </div>
        <div className="list-item-value">{x}</div>
      </div>
    );
  });

  return <div className="list">{formattedItems}</div>;
}
