import React from 'react'
import Meta from "../component/Meta"
import Header from "../component/Header"
import SideBar from '../component/SideBar'
import DashboardHeader from '../component/DashboardHeader'

const Conditions = ({dark,setDark,isMobileOpen,setIsMobileOpen}) => {

  const handleClickBody = ()=>{
    setIsMobileOpen(false)
  }

  return (
    <div className={`body ${dark && "dark"} ${isMobileOpen&&"show"}`}>
        <Meta dark={dark} title={"Home"}  content={"Homepage"} />
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
        <SideBar dark={dark} setDark={setDark}  isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
      
        <div  onClick={handleClickBody}  className="dashboard__content">
            <div className="overlay"></div>
            <DashboardHeader location="conditions"/>   
            <div className='dashboard__main'>
              <section className="term-condition__main">
                <div className="term">
                  <h4 className="title">
                    <span className="icon-clipboard-check"></span>Terms and Conditions
                  </h4>
                  <h6>Last Updated: July 24, 2022</h6>

                  <div className="body-text">
                    <h6><span>1.</span>Disclaimer</h6>
                    <p className="mb-13">
                     {`Non-fungible tokens (NFTs) are highly speculative and volatile assets. 
                     Whilst WhosLaunching.com has taken steps to ensure that the projects listed are reputable and safe,
                      users are advised to undertake their own research and proceed with caution. WhosLaunching.com does
                       not offer investment advice on any of the listed projects.`}
                    </p>
                    <p className="mb-13">
                      {`Any information provided on this website (www.WhosLaunching.com) should not be considered financial
                       or investment advice, including all information about the featured projects. 
                       The information is provided as-is with no guarantees of any kind. We cannot confirm the claims or 
                       the trustworthiness of any of the regular, featured, promoted, or sponsored projects. By using this information, 
                       you agree to not take WhosLaunching.com responsible for the results of your investment decisions. Make sure to always 
                       do your own research, as any information found on this website should not be considered financial advice.`}
                    </p>
                    <p>
                      {`WhosLaunching.com does not endorse any project.
                       Please ensure that you fully understand the risks involved and that NFT is viewed 
                       as a collectible item, not an investment.`}
                    </p>
                  </div>
                  <div className="body-text mt-19">
                    <h6><span>2.</span>Introduction</h6>
                    <p className="mb-13">
                     {` The use of this website and services on this website provided by WhosLaunching.com 
                     referred to as "Website" are subject to the following Terms & Conditions, 
                     all parts, and sub-parts of which are specifically incorporated by reference here. 
                     This Agreement shall govern the use of all pages on this website (hereinafter collectively referred to as "Website") 
                     and any services provided by or on this Website ("Services").`}
                    </p>
                    <p className="mb-13">
                      {`The Terms “we”, “us”, “our” and “NFT Calendar” refer to the Website’s operators or to anyone on their behalf. The term “you” refers to 
                      the customer visiting the Website, contributing content on the Website, or acting in any other way in connection with the Website.`}
                    </p>
                    <p className="mb-13">
                      {`The Website is offered to you conditioned upon your acceptance without modification of all these Terms, conditions, and notices set forth below (collectively, the “Terms”). By accessing or using the Website in any manner, you agree to be bound by these Terms. 
                      Please read these Terms carefully. If you do not accept all these terms and conditions, please do not use the Website.`}
                    </p>
                    <p >
                      {`Our website uses cookies. By using our website and agreeing to these terms of use, you consent to our use of cookies in accordance with these Terms.`}
                    </p>
                  </div>

                  <div className="body-text mt-19">
                    <h6><span>3.</span>Accuracy of Information</h6>
                    <p className="mb-13">
                     {`We do not guarantee the accuracy of any information provided here. 
                     The NFT and Cryptocurrency space is a fast-paced environment and any of the information provided might change at any 
                     time without any warning. Therefore, please make sure to verify all information 
                     (date, price, and everything else that can be relevant to you) from official project channels. 
                     Projects may change price, supply, sale date/time, and/or any other information without us knowing and/or without
                      us being able to update it accordingly.`}
                    </p>
                    <p className="mb-13">
                      {`The Website includes links to services or applications not operated or managed by us, 
                      we will not be liable for any form of liability arising from your reliance on, or in connection with, 
                      the content of such services and applications or any information provided by them, including but not limited to 
                      its completeness, accuracy, correctness, or it is up to date. We will not be liable for any direct or indirect damage, 
                      monetary or otherwise, arising from your use of or your reliance on the content of services you have accessed via links on the Website.`}
                    </p>
                    <p >
                      {`Occasionally there may be information on the Website that contains typographical errors, inaccuracies, or omissions that may 
                      relate to user descriptions, pricing, availability, promotions, and offers. We reserve the right, in our sole discretion, to make 
                      changes or modifications to these terms and conditions at any time and for any reason. We undertake no obligation to update, amend 
                      or clarify information on the Website, including, without limitation, pricing information, except as required by law. No specified 
                      update or refresh date applied on the Website should be taken to indicate that all information on the Website or Services has been 
                      modified or updated. Please ensure that you check the applicable Terms every time you use our site so that you understand which Terms
                       apply. You will be subject to and will be deemed to have been made aware of and to have accepted the changes in any revised Terms and
                        conditions by your continued use of the site after the date such revised terms and conditions are posted.`}
                    </p>
          
                  </div>
                  
                  <div className="body-text mt-19">
                    <h6><span>4.</span>Intellectual Property</h6>
                    <p className="mb-13">
                     {`You agree that the Website and all Services provided by us are the property of WhosLaunching.com, including all copyrights, 
                     trademarks, trade secrets, patents, and other intellectual property ("Our IP"). You agree that we own all rights, title, and interest
                      in and to the Our IP and that you will not use Our IP for any unlawful or infringing purpose. You agree not to reproduce or distribute
                       Our IP in any way, including electronically or via registration of any new trademarks, trade names, service marks, or Uniform Resource
                        Locators (URLs), without express written permission from us.`}
                    </p>
                    <p className="mb-13">
                      {`All intellectual property rights in and to the Website, including any articles, text, graphics, and all other works, such as copyrights, 
                      trademarks, etc. either the exclusive property of ours or licensed to us.`}
                    </p>
                    <p >
                      {`Copying, distributing, publicly displaying, offering to the public, transferring to the public, modifying, adapting, processing, 
                      creating derivative works, selling, leasing, or using in any other way except for private review, any part of the Website, in any 
                      manner or means without our prior written consent is strictly forbidden.`}
                    </p>
                  </div>

                  <div className="body-text mt-19">
                    <h6><span>5.</span>Payment for Services</h6>
                    <p className="mb-13">
                     {`We retain our right to turn any part or service within the Website into a paid service and thus 
                     restrict access to certain areas of the Website unless a certain fee (detailed on the Website) is paid to us.`}
                    </p>
                    <p className="mb-13">
                      {`We further reserve the right to restrict access to other areas of the Website, or the whole website, at our discretion.`}
                    </p>
                    <p>
                      {`Once paid services have started you are no longer eligible for a refund.`}
                    </p>
                  </div>
                  

                  <div className="body-text mt-19">
                    <h6><span>6.</span>Prohibited Activities</h6>
                    <p className="mb-13">
                     {`Any content and information on the Website of any kind (including, but not limited to, data, text, photos, graphics, video, etc.) 
                     are proprietary to us. You agree not to otherwise modify copy, distribute, transmit, display, perform, reproduce, publish, license, 
                     create derivative works from, transfer, sell, resell, or make any other use except private reading. Additionally, 
                     you agree not to post content that:`}
                    </p>
                    <ul className="mb-13 roundLi">
                      <li>
                        {`Contains ill-mannered, profane, abusive, racist, or hateful language or expressions, text, photographs, or illustrations that are pornographic or in poor taste, inflammatory attacks of a personal, racial, or religious nature.`}
                      </li>
                      <li>
                        {`Is defamatory, threatening, disparaging, grossly inflammatory, false, misleading, fraudulent, inaccurate, unfair, contains exaggeration, or unsubstantiated claims.`}
                      </li>
                      <li>
                        {`Violates the privacy rights of any third party is unreasonably harmful or offensive to any individual or community.`}
                      </li>
                      <li>
                        {`Discriminates on the grounds of race, religion, national origin, gender, age, marital status, sexual orientation, or disability, or refers to such matters in any manner prohibited by law.`}
                      </li>
                      <li>
                        {`Violates or inappropriately encourages the violation of any municipal, state, federal, or international law, rule, regulation, or ordinance.`}
                      </li>
                      <li>
                        {`Uses or attempts to use another's account, password, service, or system except as expressly permitted by the Terms of use uploads or transmits viruses or other harmful, disruptive, or destructive files.`}
                      </li>
                      <li>
                        {`Sends repeated messages related to another user and/or makes derogatory or offensive comments about another individual or repeats prior posting of the same message under multiple emails or subjects.`}
                      </li>
                      <li>
                        {`Any submitted content that includes, but is not limited to the following, will be refused. If repeated violations occur, we reserve the right to cancel user access to the website without advanced notice.`}
                      </li>
                    </ul>
                    <p className="mb-13">
                     {`We take no responsibility and assume no liability for any Content posted, stored, or uploaded by you or any other third party, 
                     or for any loss or damage thereto, nor are we liable for any mistakes, defamation, slander, libel, omissions, falsehoods, obscenity,
                      pornography, profanity or any other objectionable Content of any kind you may encounter.`}
                    </p>
                    <p className="mb-13">
                     {`As a provider of this Website, we are not liable for any statements, representations, or Content provided by its users on the 
                     Website. Although we have no obligation to screen, edit or monitor any of the Content posted to or distributed through the Website, 
                     we reserve the right and have absolute discretion, to examine the Content before or after its publication, and prevent the publication
                      of inappropriate or otherwise inadequate or erroneous Content, or remove such Content after its publication, as we may see fit 
                      (even when such Content does not breach these Terms). Yet we do not normally use our right to monitor Content and do so only in 
                      rare cases.`}
                    </p>
                    <p >
                     {`We retain our sole discretion to determine which Content will be published, the duration of its publication, its location, 
                     design, and any other matter pertaining to the publication of Content within the Website. We do not guarantee that all content 
                     will be published, in general, or for any limited time.`}
                    </p>
                  </div> 

                  <div className="body-text mt-19">
                    <h6><span>7.</span>Termination of Service</h6>
                    <p className="mb-13">
                     {`You may terminate your use of the Website at any time and for whatever reason. You are not obligated to advise the Website of such termination.`}
                    </p>
                    <p >
                      {`We may, at any time, terminate the provision of the Website in its entirety or any part thereof, temporarily, or permanently, at our sole discretion.`}
                    </p>      
                  </div>

                  <div className="body-text mt-19">
                    <h6><span>8.</span>Indemnification</h6>
                    <p className="mb-13">
                     {`To the maximum extent permitted by law, you agree to indemnify, defend and hold harmless WhosLaunching.com and its affiliates and/or 
                     related entities, whether direct or indirect, current, former or future, and its and their respective current, former, or future 
                     officers, directors, employees, agents, successors and assigns and related third parties (each an “Indemnified Party”), for any claims,
                      causes of action, debts, damages, losses, costs, liabilities and expenses (including reasonable attorneys’ fees) relating to or arising
                       out of any third-party claim that (a) your use of or inability to use the Services, (b) any user postings made by you, (c) your 
                       violation of any terms of this Agreement or your violation of any rights of a third-party, or(d) your violation of any applicable
                        laws, rules or regulations, except to the extent caused by any unlawful or negligent act or omission by WhosLaunching.com. 
                        WhosLaunching.com reserves the right, at its own cost, to assume the exclusive defense and control of any matter otherwise 
                        subject to indemnification by you, in which event you will fully cooperate with WhosLaunching.com in asserting any available 
                        defenses. An Indemnified Party may participate in the defense by counsel of its own choosing, at its own cost and expense. 
                        You shall not settle any claim that adversely affects an Indemnified Party or imposes any obligation or liability on an 
                        Indemnified Party without the indemnified Party’s prior written consent.`}
                    </p>      
                  </div>

                  <div className="body-text mt-19">
                    <h6><span>9.</span>Data Protection</h6>
                    <p className="mb-13">
                     {`In terms of the data collected at this website, WhosLaunching.com is the data controller.`}
                    </p>
                    <p className="mb-13">
                     {`Protection of personal data:`}
                    </p>   
                    <p className="mb-13">
                     {`WhosLaunching.com takes the matters of protection and security of Personal Data seriously and will process such information in 
                     accordance with applicable Data Protection Legislation and this Agreement. To provide the Services, WhosLaunching.com may process 
                     Personal Data about Users and others who access the Services.`}
                    </p>    
                    <p className="mb-13">
                     {`“Personal data” is information relating to an identified or identifiable natural person.`}
                    </p> 
                    <p className="mb-13">
                     {`THE TYPES OF PERSONAL DATA WE COLLECT AND USE:`}
                    </p>  
                    <ul className="mb-13 roundLi">
                      <li>
                        {`Email`}
                      </li>
                      <li>
                        {`Technical information (IP address, operating system, and browser type)`}
                      </li>
                    </ul>
                    <p className="mb-13">
                     {`WhosLaunching.com may appoint a sub-processor (the Sub-contractor) to process any personal data processed in connection with this 
                     Agreement (the Protected Data) and shall procure that any sub-contractor is made subject to the same obligations in relation to such
                      Protected Data as are contained in this clause.`}
                    </p> 
                    <p className="mb-13">
                     {`Without prejudice to the generality of this clause, in respect of Protected Data disclosed to WhosLaunching.com in connection with 
                     this Agreement (and whether disclosed by the Client, data subjects or otherwise), WhosLaunching.com shall ensure that it complies fully
                      with the data protection principles in processing the Protected Data;`}
                    </p> 
                    <ul className="mb-13 roundLi">
                      <li>
                        {`Only processes the Protected Data for purposes notified to it by the Client and/or the relevant data subjects;`}
                      </li>
                      <li>
                        {`follows such procedures and policies as may be agreed by the Parties from time to time;`}
                      </li>
                      <li>
                        {`shall not and will procure that its Sub-contractor shall not transfer the Protected Data (nor any part thereof) outside the European Economic Area without adequate protection;`}
                      </li>
                      <li>
                        {`maintains appropriate technical and organisational measures (including but not limited to, appropriate policies communicated to employees, management and review of ongoing compliance and effective security measures) to adequately protect Personal Data against accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to Personal Data.`}
                      </li>
                      <li>
                        {`WhosLaunching.com has in place an information security programme (“Security Programme”) that has administrative, technical and physical safeguards that are appropriate for its size and complexity, the nature and scope of its activities and the sensitivity of Customer Data transmitted or received in connection with this Agreement.`}
                      </li>
                    </ul>
                  </div>
                  <div className="body-text mt-19">
                    <h6><span>10.</span>Contact Us</h6>
                    <p className="mb-13">
                     {`If you would like to contact us to understand more about our terms or wish to contact us concerning any matter, you may do so by emailing `}<a className='terms-hyperling-email'>info@WhosLaunching.com</a>
                    </p>
                    
                  </div>
                </div> 
              </section>
            </div>

        </div>     
    </div>
  )
}

export default Conditions