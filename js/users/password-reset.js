const reset_btn = document.getElementById('reset-btn');
const reset_input = document.getElementById('reset_password');

let input_check = false;

const pushValue = () => {
  reset_input.addEventListener('keyup', () => {
    if (reset_input.value) {
      reset_btn.disabled = false;
      reset_btn.style.backgroundColor = '#0095f6';
    } else {
      reset_btn.disabled = true;
      reset_btn.style.backgroundColor = '#b0b0b0';
    }
  });
};

pushValue();
