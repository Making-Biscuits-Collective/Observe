import LayoutWrapper from '../partials/LayoutWrapper';
import './Help.scss';

const Help = () => {
    return (
        <LayoutWrapper>
            <section className='help-page'>
                <div className='container'>
                    <h1 className='page-title'>Help / FAQs</h1>
                    <p><strong>Observe</strong> is an application by CultureHouse to record urban planning observation data by volunteers. You can create 
                    projects, events, observations, and heatmaps. There are different types of each.</p>

                    <h2>What are projects?</h2>
                    <p>Description</p>

                    <h2>What are events?</h2>
                    <p>Description</p>

                    <h2>What are observations?</h2>
                    <p>Description</p>

                    <h2>What are heatmaps?</h2>
                    <p>Description</p>

                    <h2>I found a bug! Who do I report to?</h2>
                    <p>Please send bugs directly to Em at <b>em@makingbiscuits.co</b>.</p>
                </div>
            </section>
        </LayoutWrapper>
    )
}

export default Help;