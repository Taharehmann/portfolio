import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });

    // Clear error message when user starts typing
    if (status.type === "error") {
      setStatus({ type: "", message: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: "success",
          message: "Message sent successfully.",
        });
        setForm({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Unable to send your message. Please try again.",
        });
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setStatus({
        type: "error",
        message: "Unable to send your message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`xl:mt-12 flex lg:flex-row flex-col-reverse gap-6 sm:gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] bg-black-100/90 backdrop-blur-md border border-white/10 p-5 sm:p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-6 sm:mt-12 flex flex-col gap-4 sm:gap-8'
        >
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-2 sm:mb-4 text-[14px] sm:text-[16px]'>Your Name</span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className='bg-tertiary py-3 sm:py-4 px-4 sm:px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium text-[14px] sm:text-[16px]'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-2 sm:mb-4 text-[14px] sm:text-[16px]'>Your email</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your web address?"
              className='bg-tertiary py-3 sm:py-4 px-4 sm:px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium text-[14px] sm:text-[16px]'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-2 sm:mb-4 text-[14px] sm:text-[16px]'>Your Message</span>
            <textarea
              rows={5}
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder='What you want to say?'
              className='bg-tertiary py-3 sm:py-4 px-4 sm:px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium text-[14px] sm:text-[16px]'
            />
          </label>

          <div className="flex items-center gap-4 flex-wrap mt-2">
            <button
              type='submit'
              disabled={loading}
              className={`bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary hover:bg-[#915EFF] transition-colors duration-300 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send"}
            </button>

            {status.message && (
              <p
                className={`text-[14px] font-medium transition-opacity duration-300 ${
                  status.type === "success" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {status.message}
              </p>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='lg:flex-1 lg:h-auto md:h-[540px] sm:h-[440px] h-[380px]'
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
