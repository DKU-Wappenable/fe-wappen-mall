import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../../styles/PurchaseModal.css';

export default function PurchaseModal({ onClose, onSubmit }) {
  const [step, setStep] = useState(1);

  const initialValues = {
    quantity: 1,
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card',
  };

  const validationSchema = Yup.object({
    quantity: Yup.number().min(1, '최소 수량은 1개입니다').required('필수 입력'),
    name: Yup.string().required('이름을 입력하세요'),
    phone: Yup.string().required('연락처를 입력하세요'),
    address: Yup.string().required('배송지를 입력하세요'),
    paymentMethod: Yup.string().required('결제수단을 선택하세요'),
  });

  const handleSubmit = (values) => {
    onSubmit(values);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>주문 정보 입력</h2>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form className="purchase-form">
            <label>수량</label>
            <Field name="quantity" type="number" />
            <ErrorMessage name="quantity" component="div" className="error" />

            <label>이름</label>
            <Field name="name" type="text" />
            <ErrorMessage name="name" component="div" className="error" />

            <label>연락처</label>
            <Field name="phone" type="text" />
            <ErrorMessage name="phone" component="div" className="error" />

            <label>배송지</label>
            <Field name="address" type="text" />
            <ErrorMessage name="address" component="div" className="error" />

            <label>결제수단</label>
            <Field name="paymentMethod" as="select">
              <option value="card">카드결제</option>
              <option value="bank">무통장입금</option>
              <option value="kakaopay">카카오페이</option>
            </Field>
            <ErrorMessage name="paymentMethod" component="div" className="error" />

            <div className="modal-actions">
              <button type="submit">결제하기</button>
              <button type="button" onClick={onClose} className="cancel-btn">취소</button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
