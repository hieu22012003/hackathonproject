import { text } from 'express';
import nodemailer from 'nodemailer'

const sendEmail = async(Email) => {
    let send = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.APP_PASS
        }
    })

    let mailOption = {
        from: 'nguyenphong1000000@gmail.com',
        to:  Email,
        subject: `Đừng Quên Thời Gian Học Mỗi Ngày Cùng Gen AI Edu!`,
        text: `Thân gửi bạn,
Chỉ muốn nhắc nhẹ rằng, hôm nay là một ngày tuyệt vời để tiếp tục hành trình học tập của bạn. Chỉ cần dành ra một ít thời gian mỗi ngày, bạn sẽ tiến bộ và đạt được những mục tiêu đã đề ra.

Hãy đăng nhập vào Gen AI Edu và dành ít nhất 15 phút cho việc học hôm nay!

Hãy để mỗi ngày là một bước tiến nhỏ nhưng chắc chắn đến thành công. Chúc bạn có một buổi học tập hiệu quả và thú vị!

Trân trọng,

Gen AI Edu`
    };


    send.sendMail(mailOption,(err,res) => {
        if(err)console.log(err)
        else console.log('Email response: ',res.response)
    })
}

export {sendEmail}