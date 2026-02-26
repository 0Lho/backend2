//// api/order.js
export default async function handler(req, res) {
    // Устанавливаем CORS-заголовки для всех ответов
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Обработка preflight-запроса (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Разрешаем только POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const order = req.body;
    console.log('Заказ получен:', order);

    const TELEGRAM_BOT_TOKEN = '8698736870:AAE6r8uzyX5OYyrTDZdAs7ddItA0hDEEgJ-8';
    const ADMIN_CHAT_ID = '183339040';

    let message = `<b>Новый заказ!</b>\n\n`;
    message += `Покупатель: ${order.user?.first_name || 'Неизвестно'} (@${order.user?.username || 'нет'})\n`;
    message += `Сумма: ${order.total} ₽\n\n`;
    message += `<b>Товары:</b>\n`;
    order.items.forEach(item => {
        message += `• ${item.name} (${item.condition}) – ${item.quantity} шт. = ${item.price * item.quantity} ₽\n`;
    });

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: message, parse_mode: 'HTML' })
        });
    } catch (e) {
        console.error('Ошибка отправки в Telegram:', e);
    }

    res.status(200).json({ ok: true });
}