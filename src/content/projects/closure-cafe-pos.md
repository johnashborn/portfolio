---
title: Closure Cafe POS
summary: A desktop point-of-sale system for a cafe, with a cashier screen for taking orders and an admin panel for products and sales history.
cover: ./images/closure-cafe-menu.png
coverAlt: The Closure Cafe cashier screen. A grid of coffee product cards with prices and Add to order buttons, category filters, and a Current Order panel with subtotal, 12% VAT and total.
year: 2026
role: Solo
type: school
stack: [Java, JavaFX, MySQL, Maven]
repoUrl: https://github.com/johnashborn/Closure-Cafe-POS-System
order: 5
---

## Overview

A point-of-sale system for Closure Cafe, built as a school project for the BS Information Technology program at Bohol Island State University – Balilihan Campus.

## What I built

- **PIN login with two roles.** Cashiers and admins each get their own screens, and login and logout times are recorded.
- **Cashier screen.** A product menu loaded from the database, with category filters (Coffee, Frappes, Desserts, Pastries), live search, and an order summary that shows the subtotal, 12% VAT and total as items are added.
- **Admin dashboard.** Today's sales, monthly revenue, a weekly sales chart and today's attendance at a glance.
- **Employee management.** Add, edit and remove cashier and admin accounts, and see each employee's time in and time out.
- **Product management.** Add, edit and delete products, upload product photos and review past transactions order by order.
- **Safe product removal.** Products are switched off rather than deleted, so old transactions keep their history.

## How it works

A JavaFX desktop app, with screens designed in Scene Builder, connected to MySQL through JDBC. Every sale is saved as a transaction plus one row per item. Each row keeps the price at the time of sale, so later price changes don't rewrite old receipts.

## What I'd improve

- Hash employee PINs instead of storing them as plain values.
- Add sales reports by day and by product.
- Package it as an installer so it runs without NetBeans.

## What I learned

> Storing the price at the moment of sale, not just a link to the product, is what keeps sales records accurate.
