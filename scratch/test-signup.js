async function testSignup() {
  const url = 'https://uaptqazhwegkawyjmvrj.supabase.co/auth/v1/signup';
  const apiKey = 'sb_publishable_K19gFDOiYwbdxOfXCxjEeQ_5-5PlT5P';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'test4@foodly.local',
      password: 'TestPass123!',
      data: {
        // no full_name or role
      }
    })
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

testSignup();
