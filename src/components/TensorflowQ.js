import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs';
import * as qna from '@tensorflow-models/qna';
import React, { Component } from 'react'
import './TensorflowQ.min.css'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import { Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';


export default class TensorflowQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTfReady: false,
            isModelReady: false,
            default_question: "Who is the CEO of Google?",
            default_passage: "Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, search engine, cloud computing, software, and hardware. It is considered one of the Big Four technology companies, alongside Amazon, Apple, and Facebook. Google was founded in September 1998 by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University in California. Together they own about 14 percent of its shares and control 56 percent of the stockholder voting power through supervoting stock. They incorporated Google as a California privately held company on September 4, 1998, in California. Google was then reincorporated in Delaware on October 22, 2002. An initial public offering (IPO) took place on August 19, 2004, and Google moved to its headquarters in Mountain View, California, nicknamed the Googleplex. In August 2015, Google announced plans to reorganize its various interests as a conglomerate called Alphabet Inc. Google is Alphabet's leading subsidiary and will continue to be the umbrella company for Alphabet's Internet interests. Sundar Pichai was appointed CEO of Google, replacing Larry Page who became the CEO of Alphabet.",
            question: ' default question',
            passage: 'default pessage',
            answers: null,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ default_question: event.target.value });
    }

    async componentDidMount() {
        await tf.ready(); // preparing TensorFlow
        this.setState({ isTfReady: true, });

        this.model = await qna.load(); // preparing MobileBERT model qna
        this.setState({ isModelReady: true });
    }

    findAnswers = async (passage, question) => {
        try {
            // const question = this.state.default_question;
            // const passage = this.state.default_passage;

            const answers = await this.model.findAnswers(question, passage);

            console.log('answers: ');
            console.log(answers);

            return answers;

        } catch (error) {
            console.log('Exception Error: ', error)
        }
    }

    renderAnswer = (answer, index) => {
        const text = answer.text;

        return (

            `${text}`
        )
    }

    render() {

        const { isTfReady, isModelReady, passage, question, answers } = this.state

        const onPress = (passage, question) => {
            this.findAnswers(passage, question).then((the_answers) => {
                this.setState({ answers: the_answers });
            })
        }

        return (

            <div className="main-container">
                <div className='nav-container'>
                    <Nav
                        fill variant="tabs"
                        className="justify-content-end"
                        activeKey="/home"
                    >
                        <Nav.Item>
                            <Nav.Link href="#about-container">About</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='#qna-container'>QnA</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className='about-container'>
                    <div className='about-header'>
                        ABOUT THE QnA SERVICE
                    </div>
                    <div className='about-qna'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec ex sed metus eleifend vestibulum quis facilisis nulla. Proin viverra lobortis leo, eu mollis nisl dignissim vel. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam vehicula blandit dolor. Suspendisse potenti. Cras malesuada malesuada fringilla. Ut vitae pretium metus.<br />
                        Etiam elementum urna id est maximus feugiat. Donec elit arcu, bibendum nec imperdiet eget, dictum maximus dolor. Etiam et risus quis ante ultricies pellentesque. Nam arcu turpis, maximus sit amet accumsan accumsan, viverra tempor turpis. Praesent ornare justo eu mauris vehicula pellentesque. Maecenas eu erat in enim tempor viverra. Proin tempor, leo vel ornare viverra, nisi mi fermentum neque, quis feugiat nulla urna a purus. Cras consequat nunc sit amet fermentum interdum.
                    </div>
                </div>
                <div className='qna-container'>
                    <b>
                        TensorFlow.js ready? {isTfReady ? <p>✅</p> : 'Not ready'}
                        BERT model qna ready?
            {isModelReady ?
                            <p>✅</p> : 'Not yet'
                        }
                    </b>
                    <Form>
                        <Form.Group controlId='exampleForm.ControlTextarea1'>
                            <div className='form-font-co'>
                                <Form.Label>Passage</Form.Label>
                            </div>
                            <Form.Control as='textarea' rows='8' placeholder='passage' onChange={text => this.setState({ passage: text })} value={this.state.default_passage} readOnly></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <div className='form-font-co'>
                                <Form.Label>Question</Form.Label>
                            </div>
                            <Form.Control as='textarea' rows='3' placeholder='question' onChange={this.handleChange} defaultValue={this.state.default_question}></Form.Control>
                        </Form.Group>
                        <div className='button-container'>
                            <Button varient='primary' type='button' onClick={() => onPress(this.state.default_passage, this.state.default_question)}>
                                Find Answer
                            </Button>
                        </div>
                        <Form.Group>
                            <div className='form-font-co'>
                                <Form.Label>Answer</Form.Label>
                            </div>
                            <Form.Control as='textarea' value={isModelReady &&
                                answers &&
                                answers.map((a, index) => this.renderAnswer(a, index))} readOnly>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </div>
            </div >
        )
    }
}
