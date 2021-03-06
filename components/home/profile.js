import React from 'react';
import { Spring, animated, interpolate, Trail, Transition } from 'react-spring/renderprops.cjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithubAlt, faLinkedinIn, faWeixin, faWeibo, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import ToolTip from 'react-tooltip-lite';
import QRCode from 'qrcode.react';

function SocialTipContent({ link, src, width = 120, height = 120 }) {
  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      {link && <QRCode renderAs="svg" value={link} height="100%" width="100%" />}
      {src && <img src={src} />}
      <a className="lk" href={link}>
        <FontAwesomeIcon icon={faLink} className="lk" />
      </a>
      <style jsx>{
        `
          .lk {
            position: absolute;
            width: 100%;
            overflow: hidden;
            background: white;
            bottom: -10px;
            left: 0;
            font-size: 12px;
            line-height: 14px;
            text-decoration: none;
            text-align: right;
            color: green;
            box-sizing: border-box;
            padding-right: 5px;
            transition: 500ms ease all;
          }
          .lk:hover {
            color: black;
            // background: rgba(0, 0, 0, .5)
          }
        `
      }</style>
    </div>
  );
}

export default class extends React.PureComponent {
  state = {
    screenHeight: 0,
    screenWidth: 0,
    pageHeight: 0,
    pageWidth: 0,
    scrollTop: 0,
    tip: {
      0: false,
      1: false,
      2: false,
      3: false,
    },
  };
  componentDidMount() {
    window.document.body.addEventListener('wheel', this.onWheel);
    window.document.body.addEventListener('scroll', this.onTouchStart);
    window.document.body.addEventListener('touchstart', this.onTouchStart);
    window.document.body.addEventListener('resize', this.onResize);
    this.onWheel();
  }

  componentWillUnmount() {
    window.document.body.removeEventListener('wheel', this.onWheel);
    window.document.body.removeEventListener('resize', this.onResize);
    window.document.body.removeEventListener('touchstart', this.onTouchStart);
    window.document.body.removeEventListener('scroll', this.onTouchStart);
  }

  onWheel = event => {
    this.setState({
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth,
      pageOffsetTop: this.pageRef.offsetTop,
      pageHeight: this.pageRef.clientHeight,
      scrollTop: window.pageYOffset,
    });
  };

  onTouchStart = event => {
    this.onWheel(event);
  };

  onResize = event => {
    this.setState({
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth,
      pageHeight: this.pageRef.clientHeight,
      pageOffsetTop: this.pageRef.offsetTop,
      scrollTop: 0,
    });
  };

  toggle(item) {
    this.setState({
      tip: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        [item.key]: !this.state.tip[item.key],
      },
    });
  }

  render = ({ isMobile } = this.props) => {
    const { scrollTop, pageOffsetTop } = this.state;
    const showProfile = scrollTop >= 150;
    const showIntrotext = scrollTop >= 30 * 10 + 20;
    const showSkills = scrollTop >= 30 * 20;
    const showSkills2 = scrollTop >= 30 * 35;
    const showSkills3 = scrollTop >= 30 * 50;
    const items = [
      { icon: faGithubAlt, link: 'https://github.com/jackdon' },
      {
        icon: faLinkedinIn,
        link:
          'https://www.linkedin.com/authwall?trk=bf&trkInfo=AQGTY83FAN-ayQAAAWdJjMMI96HkvqJXaO_0OzcJrl7tv4vxhN1uSUoMvSnofkq79HktrJ_7OjQ-dNdRrdzO8meH1iFoRoNKUDNx8D0GLboiZ11jGbJRn8-sGPRNhUGeyFabMqk=&originalReferer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Flingmingxu%3Ftrk%3Dchatin_wnc_redirect_pubprofile%26ctx%3Dcnpartner%26ts%3D1543127199755%26trk%3Dprofile_share_wechat',
      },
      { icon: faWeibo, link: 'https://weibo.com/u/2950950297' },
      { icon: faWeixin, link: 'https://u.wechat.com/MPFQ9hWn-SU4ByF7tyZRQ5c'/* , src: 'http://snp-assets.oss-cn-shanghai.aliyuncs.com/snoopy/wechat_qrcode_120x120.jpg' */ },
      { icon: faTwitter, link: 'https://twitter.com/xulingming0001' },
    ].map(({ icon, link, src }, key) => ({ icon, link, src, key, isOpen: false }));
    return (
      <div className="page2" ref={e => (this.pageRef = e)}>
        <Spring
          native
          from={{
            value: showProfile ? 1 : 0,
            opacity: 0,
          }}
          to={{
            value: showProfile ? 0 : 1,
            opacity: showProfile ? 1 : 0,
          }}
          delay={0}
        >
          {({ value, opacity }) => (
            <animated.div
              style={{
                position: 'absolute',
                display: 'flex',
                top: '-3.2rem',
                transform: interpolate([value], v => `translateY(${-v * 6.4}rem) scale(${1 - v})`),
                transformOrigin: 'center',
                opacity: interpolate([opacity], s => (s < 0.8 ? s * s : s)),
                overflow: 'hidden',
              }}
            >
              <img
                className="avatar"
                style={{
                  color: '#FFF',
                }}
                src="https://snp-assets.oss-cn-shanghai.aliyuncs.com/blog_covers/avatar.jpeg"
              />
            </animated.div>
          )}
        </Spring>
        <div className="social">
          {showProfile && (
            <Trail
              items={items}
              keys={item => item.key}
              from={{ transform: 'translate3d(0, -2rem, 0)', scale: 0 }}
              to={{ transform: 'translate3d(0, 1rem, 0)', scale: 1 }}
            >
              {item => props => (
                <div
                  className="item"
                  style={{ ...props, transform: `${props.transform} scale(${props.scale})` }}
                  onClick={this.toggle.bind(this, item)} /* onMouseLeave={this.toggle.bind(this, item)} */
                >
                  <ToolTip
                    tipContentClassName="tc"
                    tipContentHover={true}
                    useHover={false}
                    isOpen={this.state.tip[item.key]}
                    direction="down"
                    content={<SocialTipContent {...item} width={isMobile == true ? '150' : '120'} height={true == isMobile ? '150' : '120'} />}
                  >
                    <FontAwesomeIcon style={{ width: '70%', height: '70%' }} icon={item.icon} />
                  </ToolTip>
                </div>
              )}
            </Trail>
          )}
        </div>
        {showIntrotext && (
          <Spring
            /* items={[{ key: 0 }]} */ from={{
              transform: 'translateY(180px)',
              opacity: 0,
            }}
            to={{
              transform: 'translateY(0)',
              opacity: 1,
            }}
          >
            {/* item =>  */ props => (
              <div
                className="introtext"
                style={{
                  ...props,
                }}
              >
                <div className="desc" style={{}}>
                  <h1>Who I am?</h1>
                  <p>
                    My name is Bruce Xu. About four years of backend programming expierence using Java. And now, I'm
                    learning Node.js and it's relatives.
                  </p>
                </div>
              </div>
            )}
          </Spring>
        )}
        <div className="skills">
          <h1 style={{ textAlign: 'center' }}>Skills</h1>
          <div className="wrapper">
            <div className="divider" />
            <h3>Programming Languages</h3>
            <div className="languages">
              {showSkills && <Trail key={"lang_l"} keys={[0, 1, 2]} items={['Java', 'Javascript', 'Python'].map((lang, idx) => ({ key: idx, lang }))}
                from={
                  {
                    transform: 'translateX(-100%)',
                    opacity: 0,
                  }
                }
                to={
                  {
                    transform: 'translateX(0)',
                    opacity: 1,
                  }
                }
              >
                {item => props => <div key={item.key} style={{ ...props }} className={"lang"}>{item.lang}</div>}
              </Trail>}
            </div>
          </div>
          <div className="wrapper">
            <div className="divider" />
            <h3>Backend Relatives</h3>
            <div className="languages">
              {showSkills2 && <Trail key={'lang_br'} keys={[0, 1, 2, 3]} items={['Node.js', 'Nginx', 'Docker', 'Micro Services'].map((lang, idx) => ({ key: idx, lang }))}
                from={
                  {
                    transform: 'translateX(-100%)',
                    opacity: 0,
                  }
                }
                to={
                  {
                    transform: 'translateX(0)',
                    opacity: 1,
                  }
                }
              >
                {item => props => <div key={item.key} style={{ ...props }} className={"lang"}>{item.lang}</div>}
              </Trail>}
            </div>
          </div>

          <div className="wrapper">
            <div className="divider" />
            <h3>Frontend Relatives</h3>
            <div className="languages">
              {showSkills3 && <Trail key={'lang_br'} keys={[0, 1, 2, 3, 4]} items={['React', 'AngularJS 1.x', 'jQuery', 'HTML5', 'CSS3'].map((lang, idx) => ({ key: idx, lang }))}
                from={
                  {
                    transform: 'translateX(-100%)',
                    opacity: 0,
                  }
                }
                to={
                  {
                    transform: 'translateX(0)',
                    opacity: 1,
                  }
                }
              >
                {item => props => <div key={item.key} style={{ ...props }} className={"lang"}>{item.lang}</div>}
              </Trail>}
            </div>
          </div>
        </div>
        <style jsx>
          {`
             {
              .page1, 
              .page2,
              .page3 {
                width: 100%;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .page2 {
                overflow: hidden;
                box-sizing: border-box;
                height: auto;
                background: rgba(255, 255, 255, .4);
              }
              .avatar {
                height: 6rem;
                border-radius: 50%;
                border: 0.2rem solid rgba(255, 255, 255, 0.4);
                overflow: hidden;
              }
              .social {
                height: 3rem;
                width: 100%;
                // background: black;
                position: absolute;
                top: 4.2rem;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .social > .item {
                // position: absolute;
                border-radius: 50%;
                border: 0.2rem solid rgba(255, 255, 255, 0.6);
                width: 2.6rem;
                height: 2.6rem;
                text-align: center;
                color: white;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .social .item:nth-child(n) {
                margin-left: 10%;
              }
              .social .item:first-child {
                margin-left: 0;
              }

              @media(max-width: 764px) {
                .social .item:nth-child(n) {
                  margin-left: 0.4rem;
                }
                .social .item:first-child {
                  margin-left: 0;
                }
                .social > .item:hover {
                  background: rgba(255, 255, 255, 0.6);
                }
              }

              .introtext {
                height: 15em;
                // background: rgba(255, 255, 255, .4);
                width: 100vw;
                top: 15em;
                position: absolute;
                padding: 5%;
                box-sizing: border-box;
                display: flex;
              }

              @media(max-width: 764px) {
                .introtext {
                  padding: 2rem;
                }
                .introtext .desc {
                  width: '100%', text-align: 'center', margin: '0 auto'
                }

              }
              .introtext h1 {
                color: white;
                font-size: 2rem;
              }
              .introtext p {
                font-weight: 300;
                font-size: 1.5rem;
              }

              @media(max-width: 568px) {
                .introtext {
                  top: 10em;
                }
                .introtext p { 
                  font-size: 1.2rem 
                };
              }
              .skills {
                font-weight: 600;
                box-sizing: border-box;
                font-size: 1rem;
                position: relative;
                color: white;
                top: 30em;
                margin-left: 10%;
                margin-right: 10%;
                padding: 2rem 2% 30rem 2%;
                padding-bottom: 30em;
                min-height: 60em;
                width: 100%;
                background: rgba(255, 255, 255, .15);
                margin-block-start: .10em;
                margin-block-end: .10em;
                text-rendering: optimizelegibility;
                -webkit-font-smoothing: antialiased;
              }
              .skills .wrapper {
                background: rgba(255, 255, 255, .2);
              }
              .skills .languages {
                display: flex;
                justify-content: center;
                font-weight: 300;
              }
              @media(max-width: 567px) {
                .skills {
                  margin-left: 0;
                  margin-right: 0;

                }
                .skills .languages, .skills h3 {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  text-align: center;
                }
              }
              .skills h3 {
                margin-top: 0px;
                font-weight: 200;
                margin-top: .5rem;
                color: rgba(255, 255, 255, .8);
              }
              .skills .divider {
                width: 100%;
                border-bottom: 1px solid rgba(255, 255, 255, .2);
                background: transparent;
              }
              .skills .languages .lang {
                padding: .75rem;
                background: transparent;
                color: white;
                font-size: 1.5rem;
                font-weight: 300;
              }
            }
          `}
        </style>
      </div>
    );
  };
}
